export default function handler(req, res) {
  req.session = null;
  res.clearCookie();
  res.redirect("/");
  res.redirect("https://accounts.spotify.com/authorize?" + params.toString());
}
