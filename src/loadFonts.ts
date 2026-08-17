const LuckiestGuyFont = new FontFace(
  "LuckiestGuy",
  "url(./fonts/LuckiestGuy-Regular.ttf)",
);

export function loadFonts() {
  return LuckiestGuyFont.load()
    .then(function (loadedFont) {
      document.fonts.add(loadedFont);
    })
    .catch(function (error) {
      console.error("Font failed to load:", error);
    });
}
