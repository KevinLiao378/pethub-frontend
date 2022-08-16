import { createApp } from "vue";
import "./assets/scss/global.scss";
import App from "./App.vue";
import { VueMasonryPlugin } from "vue-masonry";

const app = createApp(App);
app.use(VueMasonryPlugin);
app.mount("#app");
