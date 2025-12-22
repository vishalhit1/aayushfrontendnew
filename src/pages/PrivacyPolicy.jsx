import React from 'react';

export default function PrivacyPolicy() {
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
                    Privacy Policy
                </h1>
            </div>

            {/* Main Content */}
            <div className='container mt-5 mb-5'>

                {/* Introduction */}
                <section style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '15px', borderBottom: '3px solid #46aaa0', paddingBottom: '10px' }}>
                        Introduction
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000', marginBottom: '15px' }}>
                        This Privacy Policy describes how Aayush Labs (the "Site", "we", "us", or "our") collects, uses, and discloses your personal information when you visit, use our services, or make a purchase from aayushlabs.com (the "Site") or otherwise communicate with us regarding the Site (collectively, the "Services"). For purposes of this Privacy Policy, "you" and "your" means you as the user of the Services, whether you are a customer, website visitor, or another individual whose information we have collected pursuant to this Privacy Policy.
                    </p>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000' }}>
                        Please read this Privacy Policy carefully. By using and accessing any of the Services, you agree to the collection, use, and disclosure of your information as described in this Privacy Policy. If you do not agree to this Privacy Policy, please do not use or access any of the Services.
                    </p>
                </section>

                {/* Changes to This Privacy Policy */}
                <section style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '15px', borderBottom: '3px solid #46aaa0', paddingBottom: '10px' }}>
                        Changes to This Privacy Policy
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000' }}>
                        We may update this Privacy Policy from time to time, including to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will post the revised Privacy Policy on the Site, update the "Last updated" date and take any other steps required by applicable law.
                    </p>
                </section>

                {/* How We Collect and Use */}
                <section style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '15px', borderBottom: '3px solid #46aaa0', paddingBottom: '10px' }}>
                        How We Collect and Use Your Personal Information
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000', marginBottom: '15px' }}>
                        To provide the Services, we collect personal information about you from a variety of sources, as set out below. The information that we collect and use varies depending on how you interact with us.
                    </p>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000' }}>
                        In addition to the specific uses set out below, we may use information we collect about you to communicate with you, provide or improve the Services, comply with any applicable legal obligations, enforce any applicable terms of service, and to protect or defend the Services, our rights, and the rights of our users or others.
                    </p>
                </section>

                {/* What Personal Information We Collect */}
                <section style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '15px', borderBottom: '3px solid #46aaa0', paddingBottom: '10px' }}>
                        What Personal Information We Collect
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000', marginBottom: '20px' }}>
                        The types of personal information we obtain about you depends on how you interact with our Site and use our Services. When we use the term "personal information", we are referring to information that identifies, relates to, describes or can be associated with you.
                    </p>

                    <h3 style={{ fontSize: '1.2rem', color: '#46aaa0', marginBottom: '10px', marginTop: '20px' }}>
                        Information We Collect Directly from You
                    </h3>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000' }}>
                        Information that you directly submit to us through our Services may include:
                    </p>
                    <ul style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000', marginLeft: '20px' }}>
                        <li>Contact details including your name, address, phone number, and email</li>
                        <li>Order information including your name, billing address, shipping address, payment confirmation, email address, and phone number</li>
                        <li>Account information including your username, password, security questions and other information used for account security purposes</li>
                        <li>Shopping information including the items you view, put in your cart, saved into your account like loyalty points, reviews, referrals or gift cards, or purchases</li>
                        <li>Customer support information including the information you choose to include in communications with us</li>
                    </ul>
                </section>

                {/* Usage Information */}
                <section style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '15px', borderBottom: '3px solid #46aaa0', paddingBottom: '10px' }}>
                        Information We Collect About Your Usage
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000' }}>
                        We may also automatically collect certain information about your interaction with the Services ("Usage Data"). To do this, we may use cookies, pixels and similar technologies ("Cookies"). Usage Data may include information about how you access and use our Site and your account, including device information, browser information, information about your network connection, your IP address and other information regarding your interaction with the Services.
                    </p>
                </section>

                {/* Third Party Information */}
                <section style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '15px', borderBottom: '3px solid #46aaa0', paddingBottom: '10px' }}>
                        Information We Obtain from Third Parties
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000', marginBottom: '15px' }}>
                        Finally, we may obtain information about you from third parties, including from vendors and service providers who may collect information on our behalf, such as companies who support our Site and Services (like Shopify) and our payment processors, who collect payment information to process your payment in order to fulfill your orders.
                    </p>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000' }}>
                        Any information we obtain from third parties will be treated in accordance with this Privacy Policy.
                    </p>
                </section>

                {/* Cookies */}
                <section style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '15px', borderBottom: '3px solid #46aaa0', paddingBottom: '10px' }}>
                        Cookies
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000', marginBottom: '15px' }}>
                        Like many websites, we use Cookies on our Site. We use Cookies to power and improve our Site and our Services (including to remember your actions and preferences), to run analytics and better understand user interaction with the Services. We may also permit third parties and services providers to use Cookies on our Site to better tailor the services, products and advertising on our Site and other websites.
                    </p>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000' }}>
                        Most browsers automatically accept Cookies by default, but you can choose to set your browser to remove or reject Cookies through your browser controls. Please keep in mind that removing or blocking Cookies can negatively impact your user experience and may cause some of the Services, including certain features and general functionality, to work incorrectly or no longer be available.
                    </p>
                </section>

                {/* Disclosure */}
                <section style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '15px', borderBottom: '3px solid #46aaa0', paddingBottom: '10px' }}>
                        How We Disclose Personal Information
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000', marginBottom: '15px' }}>
                        In certain circumstances, we may disclose your personal information to third parties for contract fulfillment purposes, legitimate purposes and other reasons subject to this Privacy Policy. Such circumstances may include:
                    </p>
                    <ul style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000', marginLeft: '20px' }}>
                        <li>With vendors or other third parties who perform services on our behalf</li>
                        <li>With business and marketing partners to provide services and advertise to you</li>
                        <li>When you direct, request us or otherwise consent to our disclosure of certain information to third parties</li>
                        <li>With our affiliates or otherwise within our corporate group</li>
                        <li>In connection with a business transaction such as a merger or bankruptcy</li>
                    </ul>
                </section>

                {/* Children's Data */}
                <section style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '15px', borderBottom: '3px solid #46aaa0', paddingBottom: '10px' }}>
                        Children's Data
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000' }}>
                        The Services are not intended to be used by children, and we do not knowingly collect any personal information about children. If you are the parent or guardian of a child who has provided us with their personal information, you may contact us using the contact details set out below to request that it be deleted.
                    </p>
                </section>

                {/* Security */}
                <section style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '15px', borderBottom: '3px solid #46aaa0', paddingBottom: '10px' }}>
                        Security and Retention of Your Information
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000', marginBottom: '15px' }}>
                        Please be aware that no security measures are perfect or impenetrable, and we cannot guarantee "perfect security." In addition, any information you send to us may not be secure while in transit. We recommend that you do not use insecure channels to communicate sensitive or confidential information to us.
                    </p>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000' }}>
                        How long we retain your personal information depends on different factors, such as whether we need the information to maintain your account, to provide the Services, comply with legal obligations, resolve disputes or enforce other applicable contracts and policies.
                    </p>
                </section>

                {/* Your Rights */}
                <section style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '15px', borderBottom: '3px solid #46aaa0', paddingBottom: '10px' }}>
                        Your Rights
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000', marginBottom: '15px' }}>
                        Depending on where you live, you may have some or all of the rights listed below in relation to your personal information. However, these rights are not absolute, may apply only in certain circumstances and, in certain cases, we may decline your request as permitted by law.
                    </p>
                    <ul style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000', marginLeft: '20px' }}>
                        <li><strong>Right to Access / Know:</strong> You may have a right to request access to personal information that we hold about you</li>
                        <li><strong>Right to Delete:</strong> You may have a right to request that we delete personal information we maintain about you</li>
                        <li><strong>Right to Correct:</strong> You may have a right to request that we correct inaccurate personal information</li>
                        <li><strong>Right of Portability:</strong> You may have a right to receive a copy of the personal information we hold about you</li>
                        <li><strong>Restriction of Processing:</strong> You may have the right to ask us to stop or restrict our processing of personal information</li>
                        <li><strong>Withdrawal of Consent:</strong> You may have the right to withdraw consent where we rely on it to process your information</li>
                        <li><strong>Appeal:</strong> You may have a right to appeal our decision if we decline to process your request</li>
                    </ul>
                </section>

                {/* International Users */}
                <section style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '15px', borderBottom: '3px solid #46aaa0', paddingBottom: '10px' }}>
                        International Users
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000' }}>
                        Please note that we may transfer, store and process your personal information outside the country you live in. Your personal information is also processed by staff and third party service providers and partners in these countries. If we transfer your personal information out of Europe, we will rely on recognized transfer mechanisms like the European Commission's Standard Contractual Clauses.
                    </p>
                </section>

                {/* Contact Box */}
                <div style={{
                    backgroundColor: 'rgb(237 248 250)',
                    borderLeft: '5px solid #46aaa0',
                    padding: '30px',
                    borderRadius: '8px',
                    marginTop: '40px'
                }}>
                    <h3 style={{ color: '#46aaa0', marginTop: 0 }}>Contact Us</h3>
                    <p style={{ color: '#333', margin: '10px 0 0 0', lineHeight: '1.6', fontSize: '16px' }}>
                        If you have questions about this Privacy Policy or your personal information, please contact us. We will respond to your request in a timely manner as required under applicable law.
                    </p>
                </div>
            </div>
        </div>
    );
}