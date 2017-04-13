// From: https://www.npmjs.com/package/vue-slider-component
// Converted to support Vue 1.x on Rails asset pipeline

(function() {
  "use strict";

  var template = '<div v-el:wrap :class="[\'vue-slider-wrap\', flowDirection, disabledClass, { \'vue-slider-has-label\': piecewiseLabel }]" v-show="show" :style="wrapStyles" @click="wrapClick">\
                    <div v-el:elem class="vue-slider" :style="styleMerge(elemStyles, bgStyle)">\
                      <template v-if="isMoblie">\
                        <template v-if="isRange">\
                          <div v-el:dot0 :class="[tooltipStatus, \'vue-slider-dot\']" :style="styleMerge(sliderStyles[0], dotStyles)" @touchstart="moveStart(0)">\
                            <span :class="[\'vue-slider-tooltip-\' + tooltipDirection[0], \'vue-slider-tooltip\']" :style="tooltipStyles[0]">{{ formatter ? formatting(val[0]) : val[0] }}</span>\
                          </div>\
                          <div v-el:dot1 :class="[tooltipStatus, \'vue-slider-dot\']" :style="styleMerge(sliderStyles[1], dotStyles)" @touchstart="moveStart(1)">\
                            <span :class="[\'vue-slider-tooltip-\' + tooltipDirection[1], \'vue-slider-tooltip\']" :style="tooltipStyles[1]">{{ formatter ? formatting(val[1]) : val[1] }}</span>\
                          </div>\
                        </template>\
                        <template v-else>\
                          <div v-el:dot :class="[tooltipStatus, \'vue-slider-dot\']" :style="styleMerge(sliderStyles, dotStyles)" @touchstart="moveStart">\
                            <span :class="[\'vue-slider-tooltip-\' + tooltipDirection, \'vue-slider-tooltip\']" :style="tooltipStyles">{{ formatter ? formatting(val) : val}}</span>\
                          </div>\
                        </template>\
                      </template>\
                      <template v-else>\
                        <template v-if="isRange">\
                          <div v-el:dot0 :class="[tooltipStatus, \'vue-slider-dot\']" :style="styleMerge(sliderStyles[0], dotStyles)" @mousedown="moveStart(0)">\
                            <span :class="[\'vue-slider-tooltip-\' + tooltipDirection[0], \'vue-slider-tooltip\']" :style="tooltipStyles[0]">{{ formatter ? formatting(val[0]) : val[0] }}</span>\
                          </div>\
                          <div v-el:dot1 :class="[tooltipStatus, \'vue-slider-dot\']" :style="styleMerge(sliderStyles[1], dotStyles)" @mousedown="moveStart(1)">\
                            <span :class="[\'vue-slider-tooltip-\' + tooltipDirection[1], \'vue-slider-tooltip\']" :style="tooltipStyles[1]">{{ formatter ? formatting(val[1]) : val[1] }}</span>\
                          </div>\
                        </template>\
                        <template v-else>\
                          <div v-el:dot :class="[tooltipStatus, \'vue-slider-dot\']" :style="styleMerge(sliderStyles, dotStyles)" @mousedown="moveStart">\
                            <span :class="[\'vue-slider-tooltip-\' + tooltipDirection, \'vue-slider-tooltip\']" :style="tooltipStyles">{{ formatter ? formatting(val) : val }}</span>\
                          </div>\
                        </template>\
                      </template>\
                      <template v-if="piecewise">\
                        <ul class="vue-slider-piecewise">\
                          <li v-for="piecewiseObj in piecewiseDotWrap" :style="styleMerge(piecewiseDotStyle, piecewiseObj.style)">\
                            <span class="vue-slider-piecewise-dot" :style="styleMerge(piecewiseStyle, piecewiseObj.inRange ? piecewiseActiveStyle : null)"></span>\
                            <span v-if="piecewiseLabel" class="vue-slider-piecewise-label" :style="styleMerge(labelStyle, piecewiseObj.inRange ? labelActiveStyle : null)">{{ piecewiseObj.label }}</span>\
                          </li>\
                        </ul>\
                      </template>\
                      <div v-el:process class="vue-slider-process" :style="processStyle"></div>\
                    </div>\
                  </div>';

  App.vue.components.vueSlider = Vue.extend({
    template: template,
    data: function() {
      return {
        flag: false,
        size: 0,
        currentValue: 0,
        currentSlider: 0
      }
    },
    props: {
      width: {
        type: [Number, String],
        default: 'auto'
      },
      height: {
        type: [Number, String],
        default: 6
      },
      data: {
        type: Array,
        default: null
      },
      dotSize: {
        type: Number,
        default: 16
      },
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 100
      },
      interval: {
        type: Number,
        default: 1
      },
      show: {
        type: Boolean,
        default: true
      },
      disabled: {
        type: Boolean,
        default: false
      },
      piecewise: {
        type: Boolean,
        default: false
      },
      tooltip: {
        type: [String, Boolean],
        default: 'always'
      },
      eventType: {
        type: String,
        default: 'auto'
      },
      direction: {
        type: String,
        default: 'horizontal'
      },
      reverse: {
        type: Boolean,
        default: false
      },
      lazy: {
        type: Boolean,
        default: false
      },
      clickable: {
        type: Boolean,
        default: true
      },
      speed: {
        type: Number,
        default: 0.5
      },
      realTime: {
        type: Boolean,
        default: false
      },
      value: {
        type: [String, Number, Array],
        default: 0
      },
      piecewiseLabel: {
        type: Boolean,
        default: false
      },
      sliderStyle: [Array, Object],
      tooltipDir: [Array, String],
      formatter: [String, Function],
      piecewiseStyle: Object,
      piecewiseActiveStyle: Object,
      processStyle: Object,
      bgStyle: Object,
      tooltipStyle: [Array, Object],
      labelStyle: Object,
      labelActiveStyle: Object
    },
    computed: {
      flowDirection: function() {
        return 'vue-slider-' + this.direction + (this.reverse ? '-reverse' : '');
      },
      tooltipDirection: function() {
        var dir = this.tooltipDir || (this.direction === 'vertical' ? 'left' : 'top')
        if (Array.isArray(dir)) {
          return this.isRange ? dir : dir[1]
        }
        else {
          return this.isRange ? [dir, dir] : dir
        }
      },
      tooltipStatus: function() {
        return this.tooltip === 'hover' && this.flag ? 'vue-slider-always' : this.tooltip ? 'vue-slider-' + this.tooltip : ''
      },
      tooltipClass: function() {
        return ['vue-slider-tooltip-' + this.tooltipDirection, 'vue-slider-tooltip']
      },
      isMoblie: function() {
        return this.eventType === 'touch' || this.eventType !== 'mouse' && /(iPhone|iPad|iPod|iOS|Android|SymbianOS|Windows Phone|Mobile)/i.test(navigator.userAgent)
      },
      isDisabled: function() {
        return this.eventType === 'none' ? true : this.disabled
      },
      disabledClass: function() {
        return this.disabled ? 'vue-slider-disabled' : ''
      },
      isRange: function() {
        return Array.isArray(this.value)
      },
      slider: function() {
        return this.isRange ? [this.$els.dot0, this.$els.dot1] : this.$els.dot
      },
      minimum: function() {
        return this.data ? 0 : this.min
      },
      val: {
        get: function() {
          return this.data ? (this.isRange ? [this.data[this.currentValue[0]], this.data[this.currentValue[1]]] : this.data[this.currentValue]) : this.currentValue
        },
        set: function(val) {
          if (this.data) {
            if (this.isRange) {
              var index0 = this.data.indexOf(val[0])
              var index1 = this.data.indexOf(val[1])
              if (index0 > -1 && index1 > -1) {
                this.currentValue = [index0, index1]
              }
            }
            else {
              var index = this.data.indexOf(val)
              if (index > -1) {
                this.currentValue = index
              }
            }
          }
          else {
            this.currentValue = val
          }
        }
      },
      currentIndex: function() {
        if (this.isRange) {
          return this.data ? this.currentValue : [(this.currentValue[0] - this.minimum) / this.spacing, (this.currentValue[1] - this.minimum) / this.spacing]
        }
        else {
          return (this.currentValue - this.minimum) / this.spacing
        }
      },
      indexRange: function() {
        if (this.isRange) {
          return this.currentIndex
        }
        else {
          return [0, this.currentIndex]
        }
      },
      maximum: function() {
        return this.data ? (this.data.length - 1) : this.max
      },
      multiple: function() {
        var decimals = this.interval.toString().split('.')[1]
        return decimals ? Math.pow(10, decimals.length) : 1
      },
      spacing: function() {
        return this.data ? 1 : this.interval
      },
      total: function() {
        if (this.data) {
          return this.data.length - 1
        }
        else if (~~((this.maximum - this.minimum) * this.multiple) % (this.interval * this.multiple) !== 0) {
          console.error('[Vue-slider warn]: Prop[interval] is illegal, Please make sure that the interval can be divisible')
        }
        return (this.maximum - this.minimum) / this.interval
      },
      gap: function() {
        return this.size / this.total
      },
      position: function() {
        return this.isRange ? [(this.currentValue[0] - this.minimum) / this.spacing * this.gap, (this.currentValue[1] - this.minimum) / this.spacing * this.gap] : ((this.currentValue - this.minimum) / this.spacing * this.gap)
      },
      limit: function() {
        return this.isRange ? [[0, this.position[1]], [this.position[0], this.size]] : [0, this.size]
      },
      valueLimit: function() {
        return this.isRange ? [[this.minimum, this.currentValue[1]], [this.currentValue[0], this.maximum]] : [this.minimum, this.maximum]
      },
      wrapStyles: function() {
        return this.direction === 'vertical' ? {
          height: typeof this.height === 'number' ? this.height + 'px' : this.height,
          padding: (this.dotSize / 2) + 'px'
        } : {
          width: typeof this.width === 'number' ? this.width + 'px' : this.width,
          padding: (this.dotSize / 2) + 'px'
        }
      },
      sliderStyles: function() {
        if (Array.isArray(this.sliderStyle)) {
          return this.isRange ? this.sliderStyle : this.sliderStyle[1]
        }
        else {
          return this.isRange ? [this.sliderStyle, this.sliderStyle] : this.sliderStyle
        }
      },
      tooltipStyles: function() {
        if (Array.isArray(this.tooltipStyle)) {
          return this.isRange ? this.tooltipStyle : this.tooltipStyle[1]
        }
        else {
          return this.isRange ? [this.tooltipStyle, this.tooltipStyle] : this.tooltipStyle
        }
      },
      elemStyles: function() {
        return this.direction === 'vertical' ? {
          width: this.width + 'px',
          height: '100%'
        } : {
          height: this.height + 'px'
        }
      },
      dotStyles: function() {
        return this.direction === 'vertical' ? {
          width: this.dotSize + 'px',
          height: this.dotSize + 'px',
          left: (-(this.dotSize - this.width) / 2) + 'px'
        } : {
          width: this.dotSize + 'px',
          height: this.dotSize + 'px',
          top: (-(this.dotSize - this.height) / 2) + 'px'
        }
      },
      piecewiseDotStyle: function() {
        return this.direction === 'vertical' ? {
          width: this.width + 'px',
          height: this.width + 'px'
        } : {
          width: this.height + 'px',
          height: this.height + 'px'
        }
      },
      piecewiseDotWrap: function() {
        if (!this.piecewise) {
          return false
        }

        var arr = []
        var gap = (this.size - (this.direction === 'vertical' ? this.width : this.height)) / this.total
        for (var i = 0; i <= this.total; i++) {
          var style = this.direction === 'vertical' ? {
            bottom: (this.gap * i - this.width / 2) + 'px',
            left: '200px'
          } : {
            left: (this.gap * i - this.height / 2) + 'px',
            top: '0'
          }
          var index = this.reverse ? (this.total - i) : i
          var label = this.data ? this.data[index] : (this.spacing * index) + this.min
          arr.push({
            style: style,
            label: this.formatter ? this.formatting(label) : label,
            inRange: index >= this.indexRange[0] && index <= this.indexRange[1]
          })
        }
        return arr
      }
    },
    watch: {
      value: function(val) {
        this.flag || this.setValue(val)
      },
      currentValue: function(val) {
        this.value = this.val
      },
      max: function(val) {
        if (this.flag || this.data) {
          this.refresh()
        }
        else if (this.isRange) {
          var bool
          val = this.val.map(function(v) {
            if (v > val) {
              bool = true
              return val
            }
            return v
          })
          bool && this.setValue(val)
          this.refresh()
        }
        else {
          this.val > val && this.setValue(val)
          this.refresh()
        }
      },
      min: function(val) {
        if (this.flag || this.data) {
          this.refresh()
        }
        else if (this.isRange) {
          var bool
          val = this.val.map(function(v) {
            if (v < val) {
              bool = true
              return val
            }
            return v
          })
          bool && this.setValue(val)
          this.refresh()
        }
        else {
          this.val < val && this.setValue(val)
          this.refresh()
        }
      },
      show: function(bool) {
        if (bool && !this.size) {
          this.$nextTick(function() {
            this.refresh()
          })
        }
      }
    },
    methods: {
      styleMerge: function(one, two) {
        if (one === undefined) {
          return two;
        }
        if (two === undefined) {
          return one;
        }
        for (var attrname in two) { one[attrname] = two[attrname]; }
        return one;
      },
      bindEvents: function() {
        if (this.isMoblie) {
          this.$els.wrap.addEventListener('touchmove', this.moving)
          this.$els.wrap.addEventListener('touchend', this.moveEnd)
        }
        else {
          document.addEventListener('mousemove', this.moving)
          document.addEventListener('mouseup', this.moveEnd)
          document.addEventListener('mouseleave', this.moveEnd)
        }
      },
      unbindEvents: function() {
        window.removeEventListener('resize', this.refresh)

        if (this.isMoblie) {
          this.$els.wrap.removeEventListener('touchmove', this.moving)
          this.$els.wrap.removeEventListener('touchend', this.moveEnd)
        }
        else {
          document.removeEventListener('mousemove', this.moving)
          document.removeEventListener('mouseup', this.moveEnd)
          document.removeEventListener('mouseleave', this.moveEnd)
        }
      },
      formatting: function(value) {
        return typeof this.formatter === 'string' ? this.formatter.replace(/\{value\}/, value) : this.formatter(value)
      },
      getPos: function(e) {
        this.realTime && this.getStaticData()
        return this.direction === 'vertical' ? (this.reverse ? (e.pageY - this.offset) : (this.size - (e.pageY - this.offset))) : (this.reverse ? (this.size - (e.clientX - this.offset)) : (e.clientX - this.offset))
      },
      wrapClick: function(e) {
        if (this.isDisabled || !this.clickable) return false
        var pos = this.getPos(e)
        if (this.isRange) {
          this.currentSlider = pos > ((this.position[1] - this.position[0]) / 2 + this.position[0]) ? 1 : 0
        }
        this.setValueOnPos(pos)
      },
      moveStart: function(index) {
        if (this.isDisabled) return false
        else if (this.isRange) {
          this.currentSlider = index
        }
        this.flag = true
        this.$emit('drag-start', this)
      },
      moving: function(e) {
        if (!this.flag) return false
        e.preventDefault()

        if (this.isMoblie) e = e.targetTouches[0]
        this.setValueOnPos(this.getPos(e), true)
      },
      moveEnd: function(e) {
        if (this.flag) {
          this.$emit('drag-end', this)
          if (this.lazy && this.isDiff(this.val, this.value)) {
            this.syncValue()
          }
        }
        else {
          return false
        }
        this.flag = false
        this.setPosition()
      },
      setValueOnPos: function(pos, isDrag) {
        var range = this.isRange ? this.limit[this.currentSlider] : this.limit
        var valueRange = this.isRange ? this.valueLimit[this.currentSlider] : this.valueLimit
        if (pos >= range[0] && pos <= range[1]) {
          this.setTransform(pos)
          var v = (Math.round(pos / this.gap) * (this.spacing * this.multiple) + (this.minimum * this.multiple)) / this.multiple
          this.setCurrentValue(v, isDrag)
        }
        else if (pos < range[0]) {
          this.setTransform(range[0])
          this.setCurrentValue(valueRange[0])
          if (this.currentSlider === 1) this.currentSlider = 0
        }
        else {
          this.setTransform(range[1])
          this.setCurrentValue(valueRange[1])
          if (this.currentSlider === 0) this.currentSlider = 1
        }
      },
      isDiff: function(a, b) {
        if (Object.prototype.toString.call(a) !== Object.prototype.toString.call(b)) {
          return true
        }
        else if (Array.isArray(a) && a.length === b.length) {
          return a.some(function(v, i) {return v !== b[i]})
        }
        return a !== b
      },
      setCurrentValue: function(val, bool) {
        if (val < this.minimum || val > this.maximum) return false
        if (this.isRange) {
          if (this.isDiff(this.currentValue[this.currentSlider], val)) {
            this.currentValue.splice(this.currentSlider, 1, val)
            if (!this.lazy || !this.flag) {
              this.syncValue()
            }
          }
        }
        else if (this.isDiff(this.currentValue, val)) {
          this.currentValue = val
          if (!this.lazy || !this.flag) {
            this.syncValue()
          }
        }
        bool || this.setPosition()
      },
      setIndex: function(val) {
        if (Array.isArray(val) && this.isRange) {
          var value
          if (this.data) {
            value = [this.data[val[0]], this.data[val[1]]]
          }
          else {
            value = [this.spacing * val[0] + this.minimum, this.spacing * val[1] + this.minimum]
          }
          this.setValue(value)
        }
        else {
          val = this.spacing * val + this.minimum
          if (this.isRange) {
            this.currentSlider = val > ((this.currentValue[1] - this.currentValue[0]) / 2 + this.currentValue[0]) ? 1 : 0
          }
          this.setCurrentValue(val)
        }
      },
      setValue: function(val, speed, isInit) {
        if (this.isDiff(this.val, val)) {
          this.val = val
          !isInit && this.syncValue()
        }

        this.$nextTick(function() {
           this.setPosition(speed)
        })
      },
      setPosition: function(speed) {
        this.flag || this.setTransitionTime(speed === undefined ? this.speed : speed)
        if (this.isRange) {
          this.currentSlider = 0
          this.setTransform(this.position[this.currentSlider])
          this.currentSlider = 1
          this.setTransform(this.position[this.currentSlider])
        }
        else {
          this.setTransform(this.position)
        }
        this.flag || this.setTransitionTime(0)
      },
      setTransform: function(val) {
        var value = (this.direction === 'vertical' ? ((this.dotSize / 2) - val) : (val - (this.dotSize / 2))) * (this.reverse ? -1 : 1)
        var translateValue = this.direction === 'vertical' ? 'translateY(' + value + 'px)' : 'translateX(' + value + 'px)'
        var processSize = (this.currentSlider === 0 ? this.position[1] - val : val - this.position[0]) + 'px'
        var processPos = (this.currentSlider === 0 ? val : this.position[0]) + 'px'
        if (this.isRange) {
          this.slider[this.currentSlider].style.transform = translateValue
          this.slider[this.currentSlider].style.WebkitTransform = translateValue
          this.slider[this.currentSlider].style.msTransform = translateValue
          if (this.direction === 'vertical') {
            this.$els.process.style.height = processSize
            this.$els.process.style[this.reverse ? 'top' : 'bottom'] = processPos
          }
          else {
            this.$els.process.style.width = processSize
            this.$els.process.style[this.reverse ? 'right' : 'left'] = processPos
          }
        }
        else {
          this.slider.style.transform = translateValue
          this.slider.style.WebkitTransform = translateValue
          this.slider.style.msTransform = translateValue
          if (this.direction === 'vertical') {
            this.$els.process.style.height = val + 'px'
            this.$els.process.style[this.reverse ? 'top' : 'bottom'] = 0
          }
          else {
            this.$els.process.style.width = val + 'px'
            this.$els.process.style[this.reverse ? 'right' : 'left'] = 0
          }
        }
      },
      setTransitionTime: function(time) {
        time || this.$els.process.offsetWidth
        if (this.isRange) {
          for (var i = 0; i < this.slider.length; i++) {
            this.slider[i].style.transitionDuration = time + 's'
            this.slider[i].style.WebkitTransitionDuration = time + 's'
          }
          this.$els.process.style.transitionDuration = time + 's'
          this.$els.process.style.WebkitTransitionDuration = time + 's'
        }
        else {
          this.slider.style.transitionDuration = time + 's'
          this.slider.style.WebkitTransitionDuration = time + 's'
          this.$els.process.style.transitionDuration = time + 's'
          this.$els.process.style.WebkitTransitionDuration = time + 's'
        }
      },
      syncValue: function() {
        this.$emit('callback', this.val)
        this.$emit('input', this.isRange ? this.val.slice() : this.val)
      },
      getValue: function() {
        return this.val
      },
      getIndex: function() {
        return this.currentIndex
      },
      getStaticData: function() {
        if (this.$els.elem) {
          this.size = this.direction === 'vertical' ? this.$els.elem.offsetHeight : this.$els.elem.offsetWidth
          this.offset = this.direction === 'vertical' ? (this.$els.elem.getBoundingClientRect().top + window.pageYOffset || document.documentElement.scrollTop) : this.$els.elem.getBoundingClientRect().left
        }
      },
      refresh: function() {
        if (this.$els.elem) {
          this.getStaticData()
          this.setPosition()
        }
      }
    },
    created: function() {
      window.addEventListener('resize', this.refresh)
    },
    ready: function() {
      var self = this;
      this.$nextTick(function(){
        self.getStaticData()
        self.setValue(self.value, 0, true)
        self.bindEvents()
      })
    },
    destroyed: function() {
      this.unbindEvents()
    }
  });
})();
