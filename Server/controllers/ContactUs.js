const { contactUsEmail } = require("../mail/templates/contactFormRes")
const mailSender = require("../utils/mailSender")

exports.contactUsController = async (req, res) => {
  const {email,firstname, lastname, message, phoneNo, countrycode } = req.body
  console.log(req.body)

  //Mail send to Admin for enquery by user
  try{
      const data = {
        firstname,
        lastname: `${lastname ? lastname : "null"}`,
        email,
        message,
        phoneNo: `${phoneNo ? phoneNo: "null"}`,
      };
      const info = await mailSender(
        process.env.CONTACT_MAIL,
        "Enquery",
        `<html><body>${Object.keys(data).map((key) => {
          return `<p>${key} : ${data[key]}</p>`;
        })}</body></html>`
      );
  } catch{
        if(info) {
          return res.status(200).send({
            success:true,
            message: "Your message has been sent successfully",
          });
        } else {
          return res.status(403).send({
            success:false,
            message: "Something went wrong",
          });
        }
  }
  


  //Confirmation Mail send to user who have some query(message) from Admin
  try {
    const emailRes = await mailSender(
      email,
      "Your Data send successfully",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    )
    console.log("Email Res ", emailRes)
    return res.json({
      success: true,
      message: "Email send successfully",
    })

  } catch (error) {
    console.log("Error", error)
    console.log("Error message :", error.message)
    return res.json({
      success: false,
      message: "Something went wrong...",
    })
  }
}