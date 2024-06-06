const button = document.getElementById("switch");

button.addEventListener("click", () => {
  //Send http get request to /switch
  fetch("/switch", {
    method: "POST",
  }).then((data) => {
    console.log(data);
    document.location.reload();
  });
});
