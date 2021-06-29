const converted = {
    ".rangeSlider, .rangeSlider__fill": {
      display: "block",
      boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.3)",
      borderRadius: "10px"
    },
    ".rangeSlider": { position: "relative", background: "#7f8c8d" },
    ".rangeSlider__horizontal": { height: "20px", width: "100%" },
    ".rangeSlider__vertical": { height: "100%", width: "20px" },
    ".rangeSlider--disabled": {
      filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=40)",
      opacity: 0.4
    },
    ".rangeSlider__fill": { background: "#16a085", position: "absolute" },
    ".rangeSlider__fill__horizontal": { height: "100%", top: "0", left: "0" },
    ".rangeSlider__fill__vertical": { width: "100%", bottom: "0", left: "0" },
    ".rangeSlider__handle": {
      border: "1px solid #ccc",
      cursor: "pointer",
      display: "inline-block",
      width: "40px",
      height: "40px",
      position: "absolute",
      background:
        "white linear-gradient(rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.1))",
      boxShadow: "0 0 8px rgba(0, 0, 0, 0.3)",
      borderRadius: "50%"
    },
    ".rangeSlider__handle__horizontal": { top: "-10px" },
    ".rangeSlider__handle__vertical": { left: "-10px", bottom: "0" },
    ".rangeSlider__handle:after": {
      content: '""',
      display: "block",
      width: "18px",
      height: "18px",
      margin: "auto",
      position: "absolute",
      top: "0",
      right: "0",
      bottom: "0",
      left: "0",
      backgroundImage:
        "linear-gradient(rgba(0, 0, 0, 0.13), rgba(255, 255, 255, 0))",
      borderRadius: "50%"
    },
    ".rangeSlider__handle:active": {
      backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.12))"
    },
    'input[type="range"]:focus + .rangeSlider .rangeSlider__handle': {
      boxShadow: "0 0 8px rgba(142, 68, 173, 0.9)"
    },
    ".rangeSlider__buffer": {
      position: "absolute",
      top: "3px",
      height: "14px",
      background: "#2c3e50",
      borderRadius: "10px"
    }
  }
  