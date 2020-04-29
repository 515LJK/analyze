<template>
    <div class="index">
        <div class="test">
            <svg class="svg" width="200" height="200">
                <circle class="circle" cx="100" cy="100" r="50" stroke-linecap="round" fill="transparent"></circle>
            </svg>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    methods: {
    }
}
</script>

<style>
@import url('~element-ui/lib/theme-chalk/index.css');

.index {
    width: 400px;
    height: 400px;
}

.svg {
   animation: rotate 2s linear infinite; 
}

.circle {
    stroke-width: 10px;
    stroke: #409eff;
    stroke-dasharray: 90 314;
    stroke-dashoffset: 0;
    animation: rotate2 2s linear infinite;
    transition: 3s;
}

.circle:hover {
    stroke-dasharray: 157 314;
}

@keyframes rotate {
    100% {
        transform: rotate(1turn);
    }
}


@keyframes rotate2 {
    0% {
        stroke-dasharray: 0 314;
        stroke-dashoffset: 0;
    }

    50% {
        stroke-dasharray: 157 314;
        stroke-dashoffset: -157;
    }

    100% {
        stroke-dasharray: 314 314;
        stroke-dashoffset: -314;
    }
}



</style>