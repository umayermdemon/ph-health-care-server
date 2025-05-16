import app from "./app";
import config from "./app/config";

const port = config.port;

app.listen(port, () => {
  console.log("App is listening on port:", port);
});
