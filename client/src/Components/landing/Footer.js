import React, { useState } from "react";

import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import Box from "@mui/joy/Box";
import "./footer.css";
const Footer = () => {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="footer">
      <hr color="grey" />
      <div className="footer_txt">
        MAP BOOK <i className="bx bx-copyright" />
      </div>
      <br />
      <div className="footer_details">
        <div onClick={() => setPrivacyOpen(true)} className="footer_modal_text">
          Privacy Policy
        </div>

        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          open={privacyOpen}
          onClose={() => setPrivacyOpen(false)}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Sheet
            variant="outlined"
            sx={{
              maxWidth: 500,
              borderRadius: "md",
              p: 3,
              boxShadow: "lg",
            }}
          >
            <ModalClose variant="plain" sx={{ m: 1 }} />
            <Typography
              component="h2"
              id="modal-title"
              level="h4"
              textColor="inherit"
              fontWeight="lg"
              mb={1}
            >
              Privacy
            </Typography>
            <Box
              id="modal-desc"
              textColor="text.tertiary"
              sx={{
                maxHeight: 400,
                overflowY: "auto",
              }}
            >
              <Typography id="modal-desc" textColor="text.tertiary">
                <h3>Privacy Policy</h3>
                <h6>Effective Date: Dec 3, 2023</h6>
                <br />
                MapBook, ("us", "we", or "our") operates
                https://mapbook-f381d1faf354.herokuapp.com/ (the "Site"). This
                page informs you of our policies regarding the collection, use,
                and disclosure of Personal Information we receive from users of
                the Site. By using the Site, you agree to the collection and use
                of information in accordance with this policy. Information
                <h3>Collection And Use</h3> While using our Site, we may ask you
                to provide us with certain personally identifiable information
                that can be used to contact or identify you. Personally
                identifiable information may include, but is not limited to your
                name ("Personal Information"). <h3>Log Data</h3> Like many site
                operators, we collect information that your browser sends
                whenever you visit our Site ("Log Data"). This Log Data may
                include information such as your computer's Internet Protocol
                ("IP") address, browser type, browser version, the pages of our
                Site that you visit, the time and date of your visit, the time
                spent on those pages, and other statistics. <h3>Cookies</h3>{" "}
                Cookies are files with a small amount of data, which may include
                an anonymous unique identifier. Cookies are sent to your browser
                from a web site and stored on your computer's hard drive. Like
                many sites, we use "cookies" to collect information. You can
                instruct your browser to refuse all cookies or to indicate when
                a cookie is being sent. However, if you do not accept cookies,
                you may not be able to use some portions of our Site.{" "}
                <h3>Security</h3>
                The security of your Personal Information is important to us,
                but remember that no method of transmission over the Internet,
                or method of electronic storage, is 100% secure. While we strive
                to use commercially acceptable means to protect your Personal
                Information, we cannot guarantee its absolute security.{" "}
                <h3>Changes To This Privacy Policy</h3> This Privacy Policy is
                effective as of December 3, 2023 and will remain in effect
                except with respect to any changes in its provisions in the
                future, which will be in effect immediately after being posted
                on this page. We reserve the right to update or change our
                Privacy Policy at any time, and you should check this Privacy
                Policy periodically. Your continued use of the Service after we
                post any modifications to the Privacy Policy on this page will
                constitute your acknowledgment of the modifications and your
                consent to abide and be bound by the modified Privacy Policy. If
                we make any material changes to this Privacy Policy, we will
                notify you either through the email address you have provided us
                or by placing a prominent notice on our website. Contact Us If
                you have any questions about this Privacy Policy, please contact
                us.
              </Typography>
            </Box>
          </Sheet>
        </Modal>

        <div onClick={() => setContactOpen(true)} className="footer_modal_text">
          Contact Us
        </div>

        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          open={contactOpen}
          onClose={() => setContactOpen(false)}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Sheet
            variant="outlined"
            sx={{
              maxWidth: 500,
              borderRadius: "md",
              p: 3,
              boxShadow: "lg",
            }}
          >
            <ModalClose variant="plain" sx={{ m: 1 }} />
            <Typography
              component="h2"
              id="modal-title"
              level="h4"
              textColor="inherit"
              fontWeight="lg"
              mb={1}
            >
              Contact Us
            </Typography>
            <Box
              id="modal-desc"
              textColor="text.tertiary"
              sx={{
                maxHeight: 400,
                overflowY: "auto",
              }}
            >
              <Typography id="modal-desc" textColor="text.tertiary">
                <h2>Contact Us</h2> Welcome to MapBook! We're thrilled to
                connect with you. Whether you have questions, feedback, or just
                want to say hello, feel free to reach out to us.{" "}
                <h3>Contact Information</h3> <h3>Email:</h3>
                mapbook2023@gmail.com <h3>Phone:</h3> +1 (333) 444-5555
                <h3> Mailing Address (MapBook):</h3>
                100 Circle Road, Stony Brook, New York, United States ###{" "}
                <h3>
                  We appreciate your interest in MapBook, and we look forward to
                  hearing from you!
                </h3>
                <h3>
                  Best regards,
                  <br />
                  <br /> The MapBook Team
                </h3>
              </Typography>
            </Box>
          </Sheet>
        </Modal>
      </div>
    </div>
  );
};

export default Footer;
