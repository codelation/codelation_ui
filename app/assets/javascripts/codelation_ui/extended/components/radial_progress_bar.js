// # Use

// <vue-radial-progress-bar :total-steps="10" :completed-steps="5"><h4>Inner content</h4></vue-radial-progress-bar>

// # Props

// Name | Default value | Description
// ---|:---:|---
// `diameter` | `200` | Diameter of the progress bar circle in pixels.
// `totalSteps` | `10` | Total number of steps to complete progress bar.
// `completedSteps` | `0` | Number of completed steps in the progress bar.
// `startColor` | `#bbff42` | The color of the leading edge of the progress bar gradient.
// `stopColor` | `#429321` | The secondary color of the progress bar gradient.
// `innerStrokeColor` | `#323232` | Background color of the progress bar.
// `strokeWidth` | `10` | The width of the progress bar.
// `animateSpeed` | `1000` | The amount of time in milliseconds to animate one step.
// `fps` | `60` | The frames per second that the animation should run.
// `timingFunc` | `linear` | The transition timing function to use for the CSS transition. See [transition-timing-function](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function).


(function() {
  "use strict"

  var template = '<div class="vue-radial-progress-bar-container" :class="[over ? \'vue-radial-progress-bar-over\' : \'\', complete ? \'vue-radial-progress-bar-complete\' : \'\']" :style="containerStyle">\
                    <div class="vue-radial-progress-bar-inner" :style="innerCircleStyle">\
                      <slot></slot>\
                    </div>\
                    <svg class="vue-radial-progress-bar-bar"\
                         :width="diameter"\
                         :height="diameter"\
                         version="1.1"\
                         xmlns="http://www.w3.org/2000/svg">\
                      <defs>\
                        <radialGradient :id="\'radial-gradient\' + _uid"\
                                        :fx="gradient.fx"\
                                        :fy="gradient.fy"\
                                        :cx="gradient.cx"\
                                        :cy="gradient.cy"\
                                        :r="gradient.r">\
                          <stop class="vue-radial-progress-bar-start-color" offset="30%"/>\
                          <stop class="vue-radial-progress-bar-stop-color" offset="100%"/>\
                        </radialGradient>\
                      </defs>\
                      <circle class="vue-radial-progress-bar-circle" :r="innerCircleRadius"\
                              :cx="radius"\
                              :cy="radius"\
                              fill="transparent"\
                              :stroke-dasharray="circumference"\
                              stroke-dashoffset="0"\
                              stroke-linecap="round"\
                              :style="strokeStyle"></circle>\
                      <circle :transform="\'rotate(270, \' + radius + \',\' + radius + \')\'"\
                              :r="innerCircleRadius"\
                              :cx="radius"\
                              :cy="radius"\
                              fill="transparent"\
                              :stroke="\'url(#radial-gradient\' + _uid + \')\'"\
                              :stroke-dasharray="circumference"\
                              :stroke-dashoffset="circumference"\
                              stroke-linecap="round"\
                              :style="progressStyle"></circle>\
                    </svg>\
                  </div>';

  App.ui.components.extended.radialProgressBar = Vue.extend({
    template: template,
    props: {
      diameter: {
        type: Number,
        required: false,
        default: 200
      },
      totalSteps: {
        type: Number,
        required: true,
        default: 10
      },
      completedSteps: {
        type: Number,
        required: true,
        default: 0
      },
      strokeWidth: {
        type: Number,
        required: false,
        default: 10
      },
      animateSpeed: {
        type: Number,
        required: false,
        default: 1000
      },
      fps: {
        type: Number,
        required: false,
        default: 60
      },
      timingFunc: {
        type: String,
        required: false,
        default: 'linear'
      }
    },
    data: function() {
      return {
        gradient: {
          fx: 0.99,
          fy: 0.5,
          cx: 0.5,
          cy: 0.5,
          r: 0.65
        },
        gradientAnimation: null,
        currentAngle: 0,
        strokeDashoffset: 0
      }
    },
    computed: {
      over: function() {
        if (this.completedSteps > this.totalSteps) {
          return true;
        }

        return false;
      },
      complete: function() {
        if (this.completedSteps === this.totalSteps) {
          return true;
        }

        return false;
      },
      radius: function() {
        return this.diameter / 2
      },
      circumference: function() {
        return Math.PI * this.innerCircleDiameter
      },
      stepSize: function() {
        if (this.totalSteps === 0) {
          return 0
        }
        return 100 / this.totalSteps
      },
      finishedPercentage: function() {
        return this.stepSize * this.completedSteps
      },
      circleSlice: function() {
        return 2 * Math.PI / this.totalSteps
      },
      animateSlice: function() {
        return this.circleSlice / this.totalPoints
      },
      innerCircleDiameter: function() {
        return this.diameter - (this.strokeWidth * 2)
      },
      innerCircleRadius: function() {
        return this.innerCircleDiameter / 2
      },
      totalPoints: function() {
        return this.animateSpeed / this.animationIncrements
      },
      animationIncrements: function() {
        return 1000 / this.fps
      },
      hasGradient: function() {
        return true;
      },
      containerStyle: function() {
        return {
          height: this.diameter + 'px',
          width: this.diameter + 'px'
        }
      },
      progressStyle: function() {
        return {
          height: this.diameter + 'px',
          width: this.diameter + 'px',
          strokeWidth: this.strokeWidth + 'px',
          strokeDashoffset: this.strokeDashoffset,
          transition: 'stroke-dashoffset ' + this.animateSpeed + 'ms ' + this.timingFunc
        }
      },
      strokeStyle: function() {
        return {
          height: this.diameter + 'px',
          width: this.diameter + 'px',
          strokeWidth: this.strokeWidth + 'px'
        }
      },
      innerCircleStyle: function() {
        return {
          width: this.innerCircleDiameter + 'px'
        }
      }
    },
    methods: {
      getStopPointsOfCircle: function(steps) {
        var points = []
        for (var i = 0; i < steps; i++) {
          var angle = this.circleSlice * i
          points.push(this.getPointOfCircle(angle))
        }
        return points
      },
      getPointOfCircle: function(angle) {
        var radius = 0.5
        var x = radius + (radius * Math.cos(angle))
        var y = radius + (radius * Math.sin(angle))
        return {
          x: x,
          y: y
        }
      },
      gotoPoint: function() {
        var point = this.getPointOfCircle(this.currentAngle)
        this.gradient.fx = point.x
        this.gradient.fy = point.y
      },
      changeProgress: function(args) {
        var ops = args || {};
        var isAnimate = ops.isAnimate;
        this.strokeDashoffset = ((100 - this.finishedPercentage) / 100) * this.circumference
        if (this.gradientAnimation) {
          clearInterval(this.gradientAnimation)
        }
        if (!isAnimate) {
          this.gotoNextStep()
          return
        }
        var angleOffset = (this.completedSteps - 1) * this.circleSlice
        var i = (this.currentAngle - angleOffset) / this.animateSlice
        var incrementer = Math.abs(i - this.totalPoints) / this.totalPoints
        var isMoveForward = i < this.totalPoints
        var self = this;
        this.gradientAnimation = setInterval(function() {
          if (isMoveForward && i >= self.totalPoints ||
            !isMoveForward && i < self.totalPoints) {
            clearInterval(self.gradientAnimation);
            return;
          }
          self.currentAngle = angleOffset + (self.animateSlice * i);
          self.gotoPoint();
          i += isMoveForward ? incrementer : -incrementer;
        }, self.animationIncrements)
      },
      gotoNextStep: function() {
        this.currentAngle = this.completedSteps * this.circleSlice
        this.gotoPoint();
      }
    },
    watch: {
      totalSteps: function() {
        this.changeProgress({
          isAnimate: true
        })
      },
      completedSteps: function() {
        this.changeProgress({
          isAnimate: true
        })
      },
      diameter: function() {
        this.changeProgress({
          isAnimate: true
        })
      },
      strokeWidth: function() {
        this.changeProgress({
          isAnimate: true
        })
      }
    },
    created: function() {
      this.changeProgress({
        isAnimate: false
      })
    }
  });
})()
