import React from 'react';
import { motion } from 'framer-motion';
import { Send, User, Mail, Phone, ChevronRight } from 'lucide-react';
import './JoinNow.css';

const JoinNow = () => {
  return (
    <section className="join-section" id="contact">
      {/* Background Silhouette */}
      <div className="join-bg-overlay"></div>
      <div className="join-bg-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop)' }}></div>

      <div className="join-container">
        <div className="join-content">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="join-text"
          >
            <span className="join-tag">START YOUR JOURNEY</span>
            <h2 className="join-title">BECOME A <br/><span>TITAN</span></h2>
            <p className="join-desc">
              Your transformation begins here. Join our elite community and experience world-class training designed for results.
            </p>

            <div className="join-info">
              <div className="info-item">
                <div className="info-icon">01</div>
                <div className="info-text">
                  <h4>Choose Your Plan</h4>
                  <p>Select a membership that fits your lifestyle.</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">02</div>
                <div className="info-text">
                  <h4>Meet Your Coach</h4>
                  <p>Get a personalized assessment from our experts.</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">03</div>
                <div className="info-text">
                  <h4>Start Training</h4>
                  <p>Access our elite equipment and community.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="join-form-wrapper"
          >
            <form className="join-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-row">
                <div className="form-group">
                  <label><User size={14} /> Full Name</label>
                  <input type="text" placeholder="John Doe" required />
                </div>

                <div className="form-group">
                  <label><Mail size={14} /> Email Address</label>
                  <input type="email" placeholder="john@example.com" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label><Phone size={14} /> Phone Number</label>
                  <input type="tel" placeholder="+91 98765 43210" required />
                </div>

                <div className="form-group">
                  <label>Select Plan</label>
                  <select required>
                    <option value="">Choose a membership</option>
                    <option value="starter">Starter (1 Month)</option>
                    <option value="standard">Standard (3 Months)</option>
                    <option value="elite">Elite (12 Months)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Message (Optional)</label>
                <textarea placeholder="Any specific goals or medical conditions?"></textarea>
              </div>

              <div className="form-footer">
                <button type="submit" className="submit-btn">
                  SEND APPLICATION <Send size={18} />
                </button>
                <p className="trust-copy">No spam. Response within 24 hours.</p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default JoinNow;
