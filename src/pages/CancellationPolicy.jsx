import React from 'react';

export default function CancellationPolicy() {
    return (
        <div>
            {/* Header */}
            <div style={{
                background: '#F2FAF9',
                color: 'black',
                padding: '30px 20px',
                textAlign: 'center'
            }}>
                <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0, marginBottom: '10px' }}>
                    Cancellation Policy
                </h1>
            </div>

            {/* Main Content */}
            <div className='container mt-5 mb-5'>

                {/* What Personal Information We Collect */}
                <section style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '20px', color: '#000000', marginBottom: '15px', borderBottom: '3px solid #46aaa0', paddingBottom: '10px' }}>
                        1. No Refund or Cancellation After Sample Collection
                    </h2>
                    <ul style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000', marginLeft: '5px' }}>
                        <li>Once the sample is collected, no refund or cancellation is allowed.</li>
                    </ul>
                </section>
                <section style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '20px', color: '#000000', marginBottom: '15px', borderBottom: '3px solid #46aaa0', paddingBottom: '10px' }}>
                        2. Payment at the Time of Sample Collection
                    </h2>
                    <ul style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000', marginLeft: '5px' }}>
                        <li>Customers must complete payment immediately after the sample collection.</li>
                    </ul>
                </section>
                <section style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '20px', color: '#000000', marginBottom: '15px', borderBottom: '3px solid #46aaa0', paddingBottom: '10px' }}>
                        3. Cancellation Policy
                    </h2>
                    <ul style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000', marginLeft: '5px' }}>
                        <li>Cancellation on the day of booking: allowed with no charges.</li>
                        <li>If cancelled with the consent/approval of the phlebotomist: full refund with no
                            charges.</li>
                        <li>Cancellation on the day of the test (if no slots available for
                            reschedule): ₹250 cancellation fee will apply.</li>
                        <li>Prepaid Booking, you&#39;ll get a refund on your original payment mode within 5-7
                            working days</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}