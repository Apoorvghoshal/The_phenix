document.getElementById("enquiryForm").addEventListener("submit", function(e) {
  e.preventDefault();
  document.getElementById("formMsg").innerText =
    "Thank you for your enquiry. We will get back to you soon.";
  this.reset();
});
