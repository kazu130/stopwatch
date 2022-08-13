const { createApp } = Vue;

createApp({
  data() {
    return {
      setting: {
        appearance: "system",
        watch: {
          hour: "auto",
          millisecond: "auto",
        },
      },
      display_time: {
        hour: "00",
        minute: "00",
        second: "00",
        millisecond: "00",
      },
      time: {
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      },
      start_time: 0,
      timer_is_running: false,
      timer_is_pausing: false,
      timer_pausing_diff: 0,
      timer_diff: 0,
    };
  },
  methods: {
    timerStartStop: function () {
      this.timer_is_running = !this.timer_is_running;

      if (this.timer_is_running) {
        if (!this.timer_is_pausing) {
          this.timer_pausing_diff = 0;
        }
        // this.timer_pausing_diff = 3599000;
        this.start_time = new Date();
        timerInterval = setInterval(() => {
          let current_time = new Date();
          this.timer_diff =
            this.timer_pausing_diff +
            (current_time.getTime() - this.start_time.getTime());

          this.time.millisecond = Math.floor(this.timer_diff / 10) % 100;
          this.time.second = Math.floor(this.timer_diff / 1000) % 60;
          this.time.minute = Math.floor(this.timer_diff / 1000 / 60) % 60;
          this.time.hour = Math.floor(this.timer_diff / 1000 / 60 / 60);
        }, 10);
      } else {
        clearInterval(timerInterval);
        this.timer_is_pausing = true;
        this.timer_pausing_diff = this.timer_diff;
      }
    },
    timerReset: function () {
      if (this.timer_is_running || this.timer_is_pausing) {
        clearInterval(timerInterval);
      }
      this.timer_is_running = false;
      this.timer_is_pausing = false;
      this.time = {
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      };
      this.closePopup();
    },
    closePopup: function () {
      $("details[open]").removeAttr("open");
    },
    getSysTheme: function () {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        return "dark";
      }
      return "light";
    },
  },
  mounted: function () {
    $("html").attr("theme", this.getSysTheme());
  },
  computed: {
    timerState: function () {
      return this.timer_is_running ? "running" : "pausing";
    },
    hourAppearance: function () {
      if (
        this.setting.watch.hour === "show" ||
        (this.setting.watch.hour === "auto" && this.time.hour)
      ) {
        return "";
      } else {
        return "hidden";
      }
    },
    millisecondAppearance: function () {
      if (
        this.setting.watch.millisecond === "show" ||
        (this.setting.watch.millisecond === "auto" && !this.time.hour)
      ) {
        return "";
      } else {
        return "hidden";
      }
    },
  },
  watch: {
    time: {
      handler: function () {
        this.display_time = {
          millisecond: this.time.millisecond.toString().padStart(2, 0),
          second: this.time.second.toString().padStart(2, 0),
          minute: this.time.minute.toString().padStart(2, 0),
          hour: this.time.hour.toString().padStart(2, 0),
        };
      },
      deep: true,
    },
    setting: {
      handler: function () {
        let theme = this.setting.appearance;
        if (theme === "system") {
          theme = this.getSysTheme();
        }
        $("html").attr("theme", theme);
      },
      deep: true,
    },
  },
}).mount("#app");

$(".operation-button-toggle").on("click", function (e) {
  e.preventDefault();
});
