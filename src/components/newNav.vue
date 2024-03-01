<template>
  <nav class="navigation">
    <ul class="fixed-navigation navigation-top top-position">
      <li class="move">
        <router-link :to="`/`">
          <span>
            <img id="logo" alt="Logo" src="/images/icon/logo.svg" style="width: 100px" />
          </span>
        </router-link>
      </li>
    </ul>
    <!-- navigation left start -->
    <ul id="blackone">
      <li id="left"></li>
      <li id="right"></li>
      <li id="bottom"></li>
      <li id="center"></li>
    </ul>
    <ul
      ref="leftPosition"
      class="fixed-navigation navigation-left left-position"
      :style="{ left: leftPositionStyle.left, opacity: leftPositionStyle.opacity }"
    >
      <li class="move">
        <router-link :to="`about`" class="router" data-move="left">
          <span class="effect-navigation"
            ><span class="nav-indicator-wrapper"
              ><span class="nav-indicator"></span></span
            >IgghySound</span
          >
        </router-link>
      </li>
    </ul>
    <!-- navigation left end -->
    <!-- navigation right start -->
    <ul
      ref="rightPosition"
      class="fixed-navigation navigation-right right-position"
      :style="{ right: rightPositionStyle.right, opacity: rightPositionStyle.opacity }"
    >
      <li class="move">
        <router-link :to="`services`" class="router" data-move="right">
          <span class="effect-navigation"
            ><span class="nav-indicator-wrapper"
              ><span class="nav-indicator"></span></span
            >Mix & Mastering</span
          >
        </router-link>
      </li>
    </ul>
    <!-- navigation right end -->
    <!-- navigation bottom start -->
    <ul
      ref="bottomPosition"
      class="fixed-navigation navigation-bottom bottom-position"
      :style="{ bottom: bottomPositionStyle.bottom, opacity: bottomPositionStyle.opacity }"
    >
      <li class="move">
        <router-link :to="`contact`" class="router" data-move="bottom">
          <span class="effect-navigation"
            ><span class="nav-indicator-wrapper"
              ><span class="nav-indicator"></span></span
            >Contattami</span
          >
        </router-link>
      </li>
    </ul>
    <!-- navigation bottom end -->
    <ul
      ref="centerPosition"
      class="fixed-navigation navigation-center center-position"
      :style="{ top: centerPositionStyle.top, opacity: centerPositionStyle.opacity }"
    >
      <li class="move">
        <router-link :to="`selections`" class="router" data-move="center">
          <span class="effect-navigation"
            ><span class="nav-indicator-wrapper"
              ><span class="nav-indicator"></span></span
            >Portfolio tracce</span
          >
        </router-link>
      </li>
    </ul>
    <ul
      ref="loginPosition"
      class="fixed-navigation navigation-dashboard dashboard-position"
      :style="{ bottom: loginPositionStyle.bottom, right: loginPositionStyle.right, opacity: loginPositionStyle.opacity }"
    >
      <li class="move">
        <router-link v-if="user" class="router dashboard fa-solid animate__animated animate__delay animate__backInUp" :to="`dashboard`">
          <i class="fa-light fa-comment-music fa-solid animate__animated animate__delay-1s animate__fadeIn"></i>
        </router-link>
        <router-link v-if="!user" class="router firstLog fa-solid animate__animated animate__delay-1s animate__backInUp" :to="`firstLog`">
          <i class="fa-sharp fa-arrow-right-to-arc fa-solid animate__animated animate__delay-2s animate__fadeIn"></i>
        </router-link>
      </li>
    </ul>
    <ul
      ref="logoutPosition"
      class="fixed-navigation navigation-logout dashboard-position"
      :style="{ top: logoutPositionStyle.top, right: logoutPositionStyle.right, opacity: logoutPositionStyle.opacity }"
    >
      <li class="move">
        <router-link v-if="user" class="router logout fa-solid animate__animated animate__delay-1s animate__backInUp" @click="handleClick" :to="`/`">
          <i class="fa-solid fa-arrow-right-from-bracket fa-solid animate__animated animate__delay-1s animate__fadeIn"></i>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, reactive, onMounted, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import getUser from '@/auth/getUser';
import { auth } from '@/api/config';
import { signOut } from 'firebase/auth';

const router = useRouter();
const { user } = getUser();

const currentPath = ref('');

const handleClick = () => {
  signOut(auth);
};

const leftPositionStyle = reactive({ left: '0', opacity: '0' });
const rightPositionStyle = reactive({ right: '0', opacity: '0' });
const bottomPositionStyle = reactive({ bottom: '0', opacity: '0' });
const centerPositionStyle = reactive({ top: '0', opacity: '0' });
const loginPositionStyle = reactive({ bottom: '0', right: '0', opacity: '0' });
const logoutPositionStyle = reactive({ top: '0', right: '0', opacity: '0' });

watchEffect(async () => {
  const response = router.currentRoute.value.path;
  currentPath.value = response;

  if (currentPath.value === '/') {
    leftPositionStyle.left = 'calc(var(--marginNL) + var(--marginNL))';
    leftPositionStyle.opacity = '1';
    rightPositionStyle.right = 'calc(var(--marginNR) + var(--marginNR)';
    rightPositionStyle.opacity = '1';
    bottomPositionStyle.bottom = 'var(--marginNB)';
    bottomPositionStyle.opacity = '1';
    centerPositionStyle.top = '73dvh';
    centerPositionStyle.opacity = '1';
    loginPositionStyle.bottom = 'var(--marginB)';
    loginPositionStyle.right = 'var(--marginR)';
    loginPositionStyle.opacity = '1';
    logoutPositionStyle.top = 'var(--marginT)';
    logoutPositionStyle.right = 'var(--marginR)';
    logoutPositionStyle.opacity = '1';
  } else {
    leftPositionStyle.left = '-25%';
    leftPositionStyle.opacity = '0';
    rightPositionStyle.right = '-25%';
    rightPositionStyle.opacity = '0';
    bottomPositionStyle.bottom = '-25%!important';
    bottomPositionStyle.opacity = '0';
    centerPositionStyle.top = '-25%';
    centerPositionStyle.opacity = '0';
    loginPositionStyle.bottom = '-25%';
    loginPositionStyle.right = '-25%';
    loginPositionStyle.opacity = '0';
    logoutPositionStyle.top = '-25%';
    logoutPositionStyle.right = '-25%';
    logoutPositionStyle.opacity = '0';
  }

});
</script>
