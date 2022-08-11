const { createApp } = Vue;

createApp({
  data() {
    return {
      display_time: {
        hour: "00",
        minute: "00",
        second: "00",
        m_second: "00",
      },
      time: {
        hour: 0,
        minute: 0,
        second: 0,
        m_second: 0,
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
        this.start_time = new Date();
        timerInterval = setInterval(() => {
          let current_time = new Date();
          this.timer_diff =
            this.timer_pausing_diff +
            (current_time.getTime() - this.start_time.getTime());

          this.time.m_second = Math.floor(this.timer_diff / 10) % 100;
          this.time.second = Math.floor(this.timer_diff / 1000) % 60;
          this.time.minute = Math.floor(this.timer_diff / 1000 / 60) % 60;
          this.time.hour = Math.floor(this.timer_diff / 1000 / 60 / 60);
        }, 10);
      } else {
        clearInterval(timerInterval);
        this.timer_is_pausing = true;
        this.timer_pausing_diff = this.timer_diff;
      }
      console.log(this.timer_diff, this.timer_pausing_diff);
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
        m_second: 0,
      };
      this.closePopup();
    },
    closePopup: function () {
      $("details[open]").removeAttr("open");
    },
  },
  mounted: function () {},
  computed: {
    timerState: function () {
      return this.timer_is_running ? "running" : "pausing";
    },
  },
  watch: {
    time: {
      handler: function () {
        this.display_time = {
          m_second: this.time.m_second.toString().padStart(2, 0),
          second: this.time.second.toString().padStart(2, 0),
          minute: this.time.minute.toString().padStart(2, 0),
          hour: this.time.hour.toString().padStart(2, 0),
        };
      },
      deep: true,
    },
  },
}).mount("#app");
