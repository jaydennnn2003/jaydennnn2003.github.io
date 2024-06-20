// controls the text coming in from the side of the screen
// I have decided to add this for a little bit of an extra effect that will hopefully impress the user and keep them engaged through the interactivity

document.addEventListener("DOMContentLoaded", () => {
  const hiddenElements = document.querySelectorAll(".hidden");
  console.log("hiddenElements:", hiddenElements);

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          console.log("Element intersecting:", entry.target);
        } else if (entry.boundingClientRect.top > 0) {
          // Exiting from the top
          entry.target.classList.remove("show");
          entry.target.classList.add("hidden");
          console.log("Element exiting from top:", entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  hiddenElements.forEach((el) => observer.observe(el));
  console.log("Observer created and observing elements");
});
