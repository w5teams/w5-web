<template>
<a-layout-content>
    <div class="x403">
        <img :src="baseURL + '/public/logo.png'" />
        <p>403 无权限访问</p>
    </div>

</a-layout-content>
</template>

<script>
export default {
    name: "403",
    data() {
        return {
            baseURL: this.BaseURL,
        };
    },
};
</script>

<style lang="less" scoped>
.x403 {
    font-size: 40px;
    letter-spacing: 1px;
    font-weight: bold;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;

    img {
        width: 200px;
        margin-bottom: 20px;
        -webkit-filter: grayscale(100%);
        -moz-filter: grayscale(100%);
        -ms-filter: grayscale(100%);
        -o-filter: grayscale(100%);
        filter: grayscale(100%);
        filter: gray;
    }
}
</style>
