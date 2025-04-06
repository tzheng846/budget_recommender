import React from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="terms-container">
      <div className="terms-content">
        <h1>Terms and Conditions</h1>
        <p>Last updated: March 19, 2024</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to Budget Recommender. These Terms and Conditions govern your use of our website and services.
            By accessing or using our service, you agree to be bound by these Terms.
          </p>
        </section>

        <section>
          <h2>2. Definitions</h2>
          <ul>
            <li>"Service" refers to the Budget Recommender website and its features</li>
            <li>"User" refers to any individual or entity using our Service</li>
            <li>"Content" refers to any data, information, or materials provided through the Service</li>
          </ul>
        </section>

        <section>
          <h2>3. User Accounts</h2>
          <p>
            To access certain features of the Service, you must create an account. You are responsible for:
          </p>
          <ul>
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Providing accurate and complete information</li>
          </ul>
        </section>

        <section>
          <h2>4. Privacy and Data Protection</h2>
          <p>
            We are committed to protecting your privacy. Our Privacy Policy explains how we collect, use,
            and protect your personal information. By using our Service, you consent to our Privacy Policy.
          </p>
        </section>

        <section>
          <h2>5. User Responsibilities</h2>
          <p>You agree to:</p>
          <ul>
            <li>Use the Service only for lawful purposes</li>
            <li>Not engage in any activity that interferes with or disrupts the Service</li>
            <li>Not attempt to gain unauthorized access to any portion of the Service</li>
            <li>Provide accurate and truthful information</li>
          </ul>
        </section>

        <section>
          <h2>6. Intellectual Property</h2>
          <p>
            All content, features, and functionality of the Service are owned by Budget Recommender and
            are protected by international copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section>
          <h2>7. Disclaimer of Warranties</h2>
          <p>
            The Service is provided "as is" without any warranties, express or implied. We do not guarantee
            that the Service will be uninterrupted, timely, secure, or error-free.
          </p>
        </section>

        <section>
          <h2>8. Limitation of Liability</h2>
          <p>
            Budget Recommender shall not be liable for any indirect, incidental, special, consequential,
            or punitive damages resulting from your use of or inability to use the Service.
          </p>
        </section>

        <section>
          <h2>9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify users of any material
            changes by posting the new Terms on this page.
          </p>
        </section>

        <section>
          <h2>10. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
            <br />
            Email: support@budgetrecommender.com
          </p>
        </section>

        <div className="terms-footer">
          <Link to="/" className="back-link">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions; 