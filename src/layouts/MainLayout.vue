<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
      </q-toolbar>
      <div class="q-px-lg q-pt-xl q-mb-md">
        <div class="text-h3">ToDo</div>
        <div class="text-subtitle1">{{ currentDate }}</div>
      </div>
      <q-img
        src="../statics/killua.jpg"
        class="header-image absolute-top"
      />
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :width="300"
      :breakpoint="800"
    >
      <q-scroll-area
        style="height: calc(100% - 192px);
               margin-top: 192px;
               border-right: 1px solid #ddd"
      >
        <q-list padding>
          <q-item to="/" exact clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="wb_sunny" color="yellow" />
            </q-item-section>

            <q-item-section>
              My Day
            </q-item-section>
          </q-item>

          <q-item to="/event-calendar" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="event" />
              </q-item-section>

              <q-item-section>
                Calendar
              </q-item-section>
          </q-item>

          <q-item to="/next_actions" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="task_alt" />
              </q-item-section>

              <q-item-section>
                Next Actions
              </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="inbox" />
              </q-item-section>

              <q-item-section>
                In Box
              </q-item-section>
          </q-item>

        </q-list>
      </q-scroll-area>
      <q-img
        class="absolute-top"
        src="../statics/background.jpg"
        style="height: 192px"
      >
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="../statics/profile.jpg">
          </q-avatar>
          <div class="text-weight-bold">Santiago Gomez</div>
          <div>sgomezsal@gmail.com</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue';

const drawer = ref(false);

const currentDate = computed(() => {
  const today = new Date();
  let dateString = today.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  dateString = dateString.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
  return dateString;
});

function toggleLeftDrawer() {
  drawer.value = !drawer.value;
}
</script>

<style lang="scss">
  .header-image {
    height: 100%;
    z-index: -1;
    opacity: 0.8;
    filter: brightness(50%);
  }
</style>
