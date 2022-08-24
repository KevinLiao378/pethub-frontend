<script setup lang="ts">
import { LoadAction, VueEternalLoading } from "@ts-pro/vue-eternal-loading";
import { computed, reactive } from "vue";
const URL = "https://pethub.fun/api/images/";
const PAGE_SIZE = 80;
let page = 0;
type Image = {
  id: number;
  title?: string;
  image_url: string;
  is_new: boolean;
};
type PagedData = {
  next?: string;
  results: Image[];
};
let images = reactive<Image[]>([]);
const current_year = computed(() => new Date().getFullYear());

function loadImages(page: number): Promise<PagedData> {
  return fetch(`${URL}?limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`)
    .then((res) => res.json())
    .then((res) => res.data);
}
async function load({ loaded, noMore }: LoadAction): Promise<void> {
  const loadedImages = await loadImages(page);
  const newImages = loadedImages.results;
  images.push(...newImages);
  loaded(newImages.length, PAGE_SIZE);
  if (loadedImages.next) {
    page += 1;
  } else {
    noMore();
  }
}
</script>

<template>
  <header>
    <a href="/" class="a-block header">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1"
        x="0"
        y="0"
        width="30"
        height="27.5"
        viewBox="-0.0009999275207519531 -0.0005145072937011719 26.321510314941406 24.449420928955078"
        class="fill-accent"
      >
        <g>
          <path
            d="M6.808,6.742c-0.44-2.213-1.967-4.084-3.793-4.084c-1.825,0-3.016,2.412-3.016,4.668s1.969,3.988,3.794,3.988C5.62,11.314,7.294,9.173,6.808,6.742z"
          ></path>
          <path
            d="M10.206,8.623c1.758,0.488,3.946-1.123,4.131-3.596c0.166-2.25-0.798-4.463-2.56-4.953c-1.76-0.49-3.552,1.516-4.155,3.689C7.017,5.937,8.448,8.132,10.206,8.623z"
          ></path>
          <path
            d="M21.366,9.521c1.067-1.988,1.085-4.402-0.326-5.564c-1.405-1.164-3.859-0.059-5.297,1.682c-1.437,1.738-1.021,4.326,0.389,5.49C17.54,12.291,20.193,11.707,21.366,9.521z"
          ></path>
          <path
            d="M26.068,12.492c-0.729-1.49-3.175-1.5-5.017-0.6c-1.842,0.898-2.473,3.197-1.744,4.688c0.729,1.492,3.146,2.006,4.938,0.641C25.877,15.976,26.796,13.984,26.068,12.492z"
          ></path>
          <path
            d="M11.672,10.048c-4.37-0.271-9.823,3.045-9.823,7.102s4.666,7.23,9.045,7.297c6.76,0.096,8.241-3.455,7.491-7.443C17.605,12.871,14.785,10.244,11.672,10.048z"
          ></path>
        </g>
      </svg>
      PETHUB
    </a>
  </header>

  <div class="masonry-container">
    <div
      v-masonry
      fit-width="true"
      transition-duration="0.3s"
      item-selector=".grid-item"
      origin-left="false"
      gutter="12"
      class="grid"
    >
      <div
        v-masonry-tile
        v-for="image in images"
        :key="image.id"
        class="grid-item"
      >
        <img :src="image.image_url" :alt="image.title" />
        <span v-if="image.is_new" class="badge">new</span>
      </div>
    </div>
    <VueEternalLoading :load="load">
      <template #loading>
        <div class="page-load-status">
          <div class="loader-ellips">
            <span class="loader-ellips__dot"></span>
            <span class="loader-ellips__dot"></span>
            <span class="loader-ellips__dot"></span>
            <span class="loader-ellips__dot"></span>
          </div>
        </div>
      </template>
      <template #no-more>
        <div class="page-load-status">
          <p>到底了~</p>
        </div>
      </template>
    </VueEternalLoading>
  </div>

  <footer class="footer">
    &copy;
    {{ current_year }}
    PetHub
    <a href="https://beian.miit.gov.cn/" target="new">赣ICP备2022000406号-1</a>
  </footer>
</template>

<style lang="scss" scoped>
@import "./assets/scss/global.scss";

.header {
  width: 100%;
  padding: 30px 0;
  cursor: hand;
  margin: 30px auto;
  font-size: 38px;
  text-align: center;
  .fill-accent {
    fill: $color-accent;
  }
}
.masonry-container {
  max-width: 1140px;
  margin: 0 auto;
  .grid {
    margin: 0 auto;
    .grid-item {
      position: relative;
      width: 200px;
      margin-bottom: 12px;
      border-radius: 5px;
      img {
        display: block;
        width: 100%;
        height: auto;
        object-fit: cover;
        border-radius: 5px;
      }
      .badge {
        position: absolute;
        top: 0;
        left: 0;
        color: #fff;
        font-size: 10px;
        height: 18px;
        line-height: 18px;
        padding: 0 2px;
        background: rgb(180, 44, 44);
        border-top-left-radius: 5px;
        border-bottom-right-radius: 5px;
      }
    }
  }
  .page-load-status {
    padding: 20px 0;
    text-align: center;

    @keyframes reveal {
      from {
        transform: scale(0.001);
      }
      to {
        transform: scale(1);
      }
    }

    @keyframes slide {
      to {
        transform: translateX(1.5em);
      }
    }
    .loader-ellips {
      font-size: 20px;
      position: relative;
      width: 4em;
      height: 1em;
      margin: 10px auto;
      .loader-ellips__dot {
        display: block;
        width: 1em;
        height: 1em;
        border-radius: 0.5em;
        position: absolute;
        animation-duration: 0.5s;
        animation-timing-function: ease;
        animation-iteration-count: infinite;

        &:nth-child(1) {
          left: 0;
          background: #31a24e;
        }
        &:nth-child(2) {
          left: 0;
          background: #3080ee;
        }
        &:nth-child(3) {
          left: 1.5em;
          background: #e94637;
        }
        &:nth-child(4) {
          left: 3em;
          background: #fbbc16;
        }

        &:nth-child(1) {
          animation-name: reveal;
        }
        &:nth-child(2),
        &:nth-child(3) {
          animation-name: slide;
        }
        &:nth-child(4) {
          animation-name: reveal;
          animation-direction: reverse;
        }
      }
    }
  }
}
.footer {
  position: fixed;
  font-size: 12px;
  line-height: 1.5;
  bottom: 12px;
  right: 16px;
}
</style>
