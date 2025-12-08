import GlassCard from '../components/ui/GlassCard';
import SEO from '../components/SEO';
import Icon from '../components/ui/Icon';

export default function GDPR() {
  return (
    <>
      <SEO
        title="GDPR Policy - Astronote SMS Marketing"
        description="Read Astronote's GDPR Policy to understand your rights and responsibilities regarding data protection."
        path="/shopify/gdpr"
      />
      <div className="min-h-screen pt-24 pb-20 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-h1 md:text-5xl font-bold mb-4">GDPR Policy</h1>
            <p className="text-lg text-border-subtle">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <GlassCard className="p-8 md:p-12 space-y-8">
            <section>
              <h2 className="text-h2 font-bold mb-4">1. Introduction</h2>
              <p className="text-body text-border-subtle leading-relaxed mb-4">
                This GDPR Policy explains how Astronote ("we," "our," or "us") complies with the General Data Protection Regulation (GDPR) and your rights regarding personal data. This policy applies to all users of our SMS marketing platform for Shopify.
              </p>
            </section>

            <section>
              <h2 className="text-h2 font-bold mb-4">2. Your GDPR Rights</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-h3 font-semibold mb-2">2.1 Right to Access</h3>
                  <p className="text-body text-border-subtle leading-relaxed">
                    You have the right to request access to your personal data that we hold. We will provide you with a copy of your data within 30 days of your request.
                  </p>
                </div>
                <div>
                  <h3 className="text-h3 font-semibold mb-2">2.2 Right to Rectification</h3>
                  <p className="text-body text-border-subtle leading-relaxed">
                    You have the right to request correction of inaccurate or incomplete personal data. We will update your information promptly upon verification.
                  </p>
                </div>
                <div>
                  <h3 className="text-h3 font-semibold mb-2">2.3 Right to Erasure (Right to be Forgotten)</h3>
                  <p className="text-body text-border-subtle leading-relaxed">
                    You have the right to request deletion of your personal data when it is no longer necessary for the purposes for which it was collected, or when you withdraw consent.
                  </p>
                </div>
                <div>
                  <h3 className="text-h3 font-semibold mb-2">2.4 Right to Restrict Processing</h3>
                  <p className="text-body text-border-subtle leading-relaxed">
                    You have the right to request restriction of processing of your personal data in certain circumstances, such as when you contest the accuracy of the data.
                  </p>
                </div>
                <div>
                  <h3 className="text-h3 font-semibold mb-2">2.5 Right to Data Portability</h3>
                  <p className="text-body text-border-subtle leading-relaxed">
                    You have the right to receive your personal data in a structured, commonly used, and machine-readable format and to transmit that data to another controller.
                  </p>
                </div>
                <div>
                  <h3 className="text-h3 font-semibold mb-2">2.6 Right to Object</h3>
                  <p className="text-body text-border-subtle leading-relaxed">
                    You have the right to object to processing of your personal data for direct marketing purposes or for reasons related to your particular situation.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-h2 font-bold mb-4">3. Data Collection and Processing</h2>
              <div className="space-y-4">
                <p className="text-body text-border-subtle leading-relaxed">
                  We collect and process your data to provide you with specialized and quality solutions tailored to your business needs. This includes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body text-border-subtle ml-4">
                  <li>Analyzing your revenue and usage patterns to offer personalized solutions</li>
                  <li>Providing targeted offers and recommendations based on your business performance</li>
                  <li>Improving our services to better meet your specific requirements</li>
                  <li>Ensuring compliance with legal obligations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-h2 font-bold mb-4">4. Customer Responsibilities and Liability</h2>
              <div className="p-4 bg-red-500/10 border-2 border-red-500/30 rounded-lg mb-4">
                <div className="flex items-start gap-3">
                  <Icon name="error" size="md" variant="default" className="text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-h3 font-semibold text-red-500 mb-2">Important: Customer Liability</h3>
                    <p className="text-body text-border-subtle leading-relaxed mb-2">
                      <strong>You are solely responsible for ensuring compliance with GDPR regulations and our application's terms of service.</strong>
                    </p>
                    <p className="text-body text-border-subtle leading-relaxed">
                      If you fail to comply with GDPR requirements or violate our application's terms and conditions, <strong>all liability and responsibility rests entirely with you.</strong> Astronote provides tools and features to assist with compliance, but the ultimate responsibility for GDPR compliance lies with you as the data controller.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-h3 font-semibold mb-2">4.1 Your Obligations</h3>
                  <ul className="list-disc list-inside space-y-2 text-body text-border-subtle ml-4">
                    <li>Obtain proper consent from data subjects before collecting personal data</li>
                    <li>Maintain accurate records of consent and data processing activities</li>
                    <li>Implement appropriate technical and organizational measures to protect personal data</li>
                    <li>Respond to data subject requests (access, rectification, erasure, etc.)</li>
                    <li>Report data breaches to relevant authorities within 72 hours if required</li>
                    <li>Ensure all third-party integrations comply with GDPR requirements</li>
                    <li>Comply with all applicable data protection laws and regulations</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-h3 font-semibold mb-2">4.2 Consequences of Non-Compliance</h3>
                  <p className="text-body text-border-subtle leading-relaxed mb-2">
                    Failure to comply with GDPR regulations or our terms of service may result in:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-body text-border-subtle ml-4">
                    <li>Legal action and regulatory fines imposed on you</li>
                    <li>Termination of your account and access to our services</li>
                    <li>Loss of data and service availability</li>
                    <li>Reputational damage to your business</li>
                  </ul>
                  <p className="text-body text-border-subtle leading-relaxed mt-4">
                    <strong>Astronote will not be held liable for any damages, fines, or legal consequences resulting from your failure to comply with GDPR or our terms of service.</strong>
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-h2 font-bold mb-4">5. Data Processing Agreement</h2>
              <p className="text-body text-border-subtle leading-relaxed mb-4">
                When you use Astronote's services, you act as the data controller for your customers' personal data, and we act as a data processor. This means:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body text-border-subtle ml-4">
                <li>You are responsible for determining the purposes and means of processing your customers' data</li>
                <li>You must ensure you have a legal basis for processing personal data</li>
                <li>We process data only according to your instructions and for the purposes specified in our service agreement</li>
                <li>We implement appropriate security measures to protect the data we process on your behalf</li>
              </ul>
            </section>

            <section>
              <h2 className="text-h2 font-bold mb-4">6. Data Breach Notification</h2>
              <p className="text-body text-border-subtle leading-relaxed mb-4">
                In the event of a data breach that may affect your customers' personal data:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body text-border-subtle ml-4">
                <li>We will notify you immediately upon becoming aware of the breach</li>
                <li>You are responsible for notifying affected data subjects and relevant supervisory authorities as required by GDPR</li>
                <li>You must comply with all notification requirements within the 72-hour timeframe specified by GDPR</li>
              </ul>
            </section>

            <section>
              <h2 className="text-h2 font-bold mb-4">7. Exercising Your Rights</h2>
              <p className="text-body text-border-subtle leading-relaxed mb-4">
                To exercise any of your GDPR rights, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-ice-accent/10 rounded-lg">
                <p className="text-body text-border-subtle">
                  <strong>Email:</strong> <a href="mailto:privacy@astronote.com" className="text-ice-accent hover:underline">privacy@astronote.com</a>
                </p>
                <p className="text-body text-border-subtle mt-2">
                  <strong>GDPR Requests:</strong> <a href="mailto:gdpr@astronote.com" className="text-ice-accent hover:underline">gdpr@astronote.com</a>
                </p>
                <p className="text-body text-border-subtle mt-2">
                  <strong>Support:</strong> <a href="mailto:support@astronote.com" className="text-ice-accent hover:underline">support@astronote.com</a>
                </p>
              </div>
              <p className="text-body text-border-subtle leading-relaxed mt-4">
                We will respond to your request within 30 days as required by GDPR.
              </p>
            </section>

            <section>
              <h2 className="text-h2 font-bold mb-4">8. Supervisory Authority</h2>
              <p className="text-body text-border-subtle leading-relaxed">
                If you believe that we have not addressed your concerns regarding the processing of your personal data, you have the right to lodge a complaint with your local data protection supervisory authority.
              </p>
            </section>

            <section>
              <h2 className="text-h2 font-bold mb-4">9. Changes to This Policy</h2>
              <p className="text-body text-border-subtle leading-relaxed">
                We may update this GDPR Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-h2 font-bold mb-4">10. Contact Information</h2>
              <p className="text-body text-border-subtle leading-relaxed mb-4">
                For questions about this GDPR Policy or to exercise your rights, please contact us:
              </p>
              <div className="mt-4 p-4 bg-ice-accent/10 rounded-lg">
                <p className="text-body text-border-subtle">
                  <strong>Data Protection Officer:</strong> <a href="mailto:dpo@astronote.com" className="text-ice-accent hover:underline">dpo@astronote.com</a>
                </p>
                <p className="text-body text-border-subtle mt-2">
                  <strong>Privacy:</strong> <a href="mailto:privacy@astronote.com" className="text-ice-accent hover:underline">privacy@astronote.com</a>
                </p>
                <p className="text-body text-border-subtle mt-2">
                  <strong>Support:</strong> <a href="mailto:support@astronote.com" className="text-ice-accent hover:underline">support@astronote.com</a>
                </p>
              </div>
            </section>
          </GlassCard>
        </div>
      </div>
    </>
  );
}

