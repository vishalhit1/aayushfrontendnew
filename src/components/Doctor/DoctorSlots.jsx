import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Card, Row, Col, Spinner, Collapse, Badge } from "react-bootstrap";
import { doctorAPI } from "../../api/axios";
import { toast } from "react-toastify";
import { ChevronDown, ChevronUp } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DoctorSlots = ({ doctorId }) => {
  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openDay, setOpenDay] = useState("Mon");
  const saveButtonRef = useRef(null);

  useEffect(() => {
    if (doctorId) fetchDoctor();
  }, [doctorId]);

  const fetchDoctor = async () => {
    try {
      const res = await doctorAPI.get(`/api/doctors/${doctorId}`);
      const doc = res.data.doctor;

      // Ensure all days are present in slotsConfig
      doc.slotsConfig = days.map(day => {
        const existing = doc.slotsConfig?.find(cfg => cfg.day === day) || {};
        return {
          day,
          available: existing.available ?? false,
          startTime: existing.startTime || "09:00",
          endTime: existing.endTime || "17:00",
          slotInterval: existing.slotInterval || 30,
        };
      });

      setDoctor(doc);
      setSlots(doc.slots || []);

      //changed part 
      const todayIndex = new Date().getDay(); // 0 = Sun, 1 = Mon, etc.
    const today = days[(todayIndex + 6) % 7]; // Adjust so Mon = first day
    setOpenDay(today);
      //


    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch doctor data");
    } finally {
      setLoading(false);
    }
  };

  /** Generate slots for a single day */
  const generateSlots = (day) => {
    const cfg = doctor.slotsConfig.find(c => c.day === day);
    if (!cfg || !cfg.available) return toast.error("Configure this day first!");

    const [sh, sm] = cfg.startTime.split(":").map(Number);
    const [eh, em] = cfg.endTime.split(":").map(Number);
    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    if (endMinutes <= startMinutes) return toast.warn(`Invalid timing for ${day}`);

    const interval = cfg.slotInterval || 30;
    const newDaySlots = [];

    for (let m = startMinutes; m < endMinutes; m += interval) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      const time = `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
      newDaySlots.push({ date: day, time, available: true });
    }

    // Merge with existing slots, remove old day slots
    setSlots(prev => [...prev.filter(s => s.date !== day), ...newDaySlots]);
    toast.success(`${day} slots generated!`);
  };

  /** Toggle slot availability */
  const toggleSlot = (date, time) => {
    setSlots(prev =>
      prev.map(s => (s.date === date && s.time === time ? { ...s, available: !s.available } : s))
    );
  };

  /** Handle day config changes */
  const handleConfigChange = (dayIdx, field, value) => {
    const updated = [...doctor.slotsConfig];
    updated[dayIdx][field] = field === "slotInterval" ? Number(value) : value;
    setDoctor(prev => ({ ...prev, slotsConfig: updated }));
  };

  /** Save slots for a single day */
  const saveDaySlots = async (day) => {
    const daySlots = slots.filter(s => s.date === day);
    if (!daySlots.length) return toast.warn("Generate slots before saving!");

    setSaving(true);
    try {
      const res = await doctorAPI.put(`/api/doctors/${doctorId}/slots`, {
        slots: daySlots,
        slotsConfig: doctor.slotsConfig,
        day,
      });
      if (res.data.success) toast.success(`${day} slots saved successfully!`);
      else toast.error("Failed to save slots");
    } catch (err) {
      console.error(err);
      toast.error("Error saving slots");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-2">🩺 Doctor Slot Management</h3>
      <small className="text-muted mb-3 d-block">Configure weekly availability and consultation timings.</small>

      {doctor.slotsConfig.map((cfg, idx) => (
        <Card key={cfg.day} className="mb-3 shadow-sm rounded-3">
          <Card.Header
            onClick={() => setOpenDay(openDay === cfg.day ? null : cfg.day)}
            className="d-flex justify-content-between align-items-center bg-light cursor-pointer"
          >
            <div className="d-flex align-items-center gap-2">
              <b>{cfg.day}</b>
              <Badge bg={cfg.available ? "success" : "secondary"}>
                {cfg.available ? "Available" : "Off Day"}
              </Badge>
            </div>
            {openDay === cfg.day ? <ChevronUp /> : <ChevronDown />}
          </Card.Header>

          <Collapse in={openDay === cfg.day}>
            <Card.Body className="pt-3 pb-4">
              <Row>
                <Col md={3}>
                  <Form.Check
                    type="switch"
                    id={`available-${cfg.day}`}
                    label="Doctor Available"
                    checked={cfg.available}
                    onChange={e => handleConfigChange(idx, "available", e.target.checked)}
                  />
                </Col>

                {cfg.available && (
                  <>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Start Time</Form.Label>
                        <Form.Control
                          type="time"
                          value={cfg.startTime}
                          onChange={e => handleConfigChange(idx, "startTime", e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>End Time</Form.Label>
                        <Form.Control
                          type="time"
                          value={cfg.endTime}
                          onChange={e => handleConfigChange(idx, "endTime", e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Slot Interval</Form.Label>
                        <Form.Select
                          value={cfg.slotInterval}
                          onChange={e => handleConfigChange(idx, "slotInterval", e.target.value)}
                        >
                          <option value={15}>15 mins</option>
                          <option value={30}>30 mins</option>
                          <option value={60}>1 hour</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </>
                )}
              </Row>

              {cfg.available && (
                <div className="mt-3 d-flex gap-2">
                  <Button variant="info" onClick={() => generateSlots(cfg.day)}>Generate Slots</Button>
                  <Button variant="success" onClick={() => saveDaySlots(cfg.day)} disabled={saving}>
                    {saving ? "Saving..." : "Save Day Slots"}
                  </Button>
                </div>
              )}
            </Card.Body>
          </Collapse>
        </Card>
      ))}

      <h4 className="fw-bold mt-4">🕒 Slot Preview</h4>
      <small className="text-muted mb-3 d-block">Click on any slot to toggle availability.</small>

      {days.map(day => {
        const daySlots = slots.filter(s => s.date === day);
        return (
          <div key={day} className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">{day}</h6>
              {daySlots.length > 0 && <Badge bg="info">{daySlots.filter(s => s.available).length} Active</Badge>}
            </div>
            <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
              {daySlots.length ? (
                daySlots.map(slot => (
                  <span
                    key={slot.time}
                    onClick={() => toggleSlot(day, slot.time)}
                    className="badge m-1 p-2"
                    style={{
                      cursor: "pointer",
                      background: slot.available ? "#198754" : "#dc3545",
                      color: "white",
                      fontSize: "0.9rem",
                    }}
                  >
                    {slot.time} {slot.available ? "✓" : "✗"}
                  </span>
                ))
              ) : (
                <small className="text-muted">No slots generated</small>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DoctorSlots;
