import React from 'react';

export default function TermsandCondition() {
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
                    Terms And Condition
                </h1>
            </div>

            {/* Main Content */}
            <div className='container mt-5 mb-5'>

                {/* Introduction */}
                <section style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '15px', borderBottom: '3px solid #46aaa0', paddingBottom: '10px' }}>
                        Terms of Use
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000', marginBottom: '15px' }}>
                        Any person entering the website and accessing it accepts the Terms and Conditions and the
                        Privacy . Use of the website for the purpose of browsing, purchase of goods, use of services and
                        the details provided for logging-in will be presumed to be of that of a person above the age of
                        18 years in pursuance of the Indian Contract Act, 1872. Please read the terms and conditions
                        carefully as they govern the relationship between us. These terms of the offer for sale (&quot;Supply
                        Terms&quot;) apply to products and services purchased . Under these Supply Terms, the users of the
                        website will be referred to as (&quot;You&quot; or &quot;Your&quot; or &quot;Yourself&quot; or &quot;User&quot; or Customers). A user is
                        defined as anyone who is browsing the website with or without the intention to buy. The
                        company reserves the right to modify the terms and conditions from time to time, without
                        notice and without liability to you or any third party. You are responsible for regularly reviewing
                        these Terms of use so that you will be apprised of changes if any. By continuing to use our
                        services after modifications, you agree that you are bound by the amended terms and
                        conditions. Nothing in these Terms of Use should be construed to confer any rights to third
                        party beneficiaries.
                    </p>
                </section>

                {/* Changes to This Privacy Policy */}
                <section style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '15px', borderBottom: '3px solid #46aaa0', paddingBottom: '10px' }}>
                        General
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000' }}>
                        Please read the terms of the offer for sale carefully before purchasing any products or availing any services on the website. Any purchase made by you through the website shall signify your acceptance of the supply terms and your agreement to be legally bound by the same. In addition to the above, you shall also be bound by the terms of use of the website or additional terms of use that are displayed with the selection of the product. (Additional Terms). If there is any conflict between the basic supply terms and the additional terms, the additional terms shall take precedence in relation to that sale.
                    </p>
                </section>

                {/* How We Collect and Use */}
                <section style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '15px', borderBottom: '3px solid #46aaa0', paddingBottom: '10px' }}>
                        Services
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000', marginBottom: '15px' }}>
                        Provides a wide range of exclusive sarees, which are handwoven and handcrafted. You may avail of special services available on this website as a Member. You are qualified as a member if you have registered on the website and provided  with your contact details. Shipping charges for all products/services sold on the website will be as per the companies policy. The shipping policy may be changed  from time to time.
                    </p>
                </section>

                {/* What Personal Information We Collect */}
                <section style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '15px', borderBottom: '3px solid #46aaa0', paddingBottom: '10px' }}>
                        Representation of Products & Conformity of Goods
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000', marginBottom: '20px' }}>
                        The representation of the color scheme of all the products is as accurate as possible; however, in some cases, they are only indicative in nature. Items on the website may slightly vary in color due to screen defaults and photography. You are requested to thoroughly peruse the measurements provided in the detailed information section for each product.  Shall not be liable for legal action on this account. The product information and specification provided are not binding but are carefully considered to provide a general description of each product.
                    </p>

                </section>

                {/* Usage Information */}
                <section style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '15px', borderBottom: '3px solid #46aaa0', paddingBottom: '10px' }}>
                        Order, Payment & Delivery
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#000000' }}>
                        In order to purchase our products, add the product to cart, fill in the billing & shipping address, choose the appropriate approved payment gateway and complete the payment. You may use Credit Card, Debit Card or Net Banking for making payment. All prices displayed are inclusive of taxes at the current rate. In case the bank/payment gateway refuses to honor the transaction, then shall have the right to refuse to ship the order to the customer without any liability whatsoever. Notwithstanding receipt of payment, we reserves the right to cancel the shipment (full refund being given within 3 days) in case of non-availability or for any other reason not specifiable without any liability. The information that you provide to us will not be utilized or shared with any third party unless required in relation to fraud verification by law, regulation or court order. You will be solely responsible for the security and confidentiality of your credit/debit card details. We expressly disclaims all liabilities that may arise as a consequence of any unauthorized credit card use.
                    </p>
                </section>
            </div>
        </div>
    );
}