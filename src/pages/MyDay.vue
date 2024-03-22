<template>
  <q-page class="column">
    <div class="row q-pa-sm bg-primary">
      <q-input
        v-model="newTask"
        @keyup.enter="addTask"
        class="col"
        square
        filled
        bg-color="dark"
        placeholder="Add tasks"
        dense
      >
        <template v-slot:append>
          <q-btn
            @click="addTask"
            round
            dense
            flat
            icon="add"
          />
        </template>
      </q-input>
    </div>
    <q-list separator bordered class="bg-dark">
      <q-item
        v-for="(task, index) in tasks"
        v-ripple
        :key="task.title"
        @click="openTaskDetails(task)"
        :class="{ 'done bg-gray-1' : task.done }"
        clickable
      >
        <q-item-section avatar>
          <q-checkbox
            v-model="task.done"
            :color="'primary'"
            @click.stop
            class="custom-checkbox"
            size="lg"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ task.title }}</q-item-label>
        </q-item-section>
        <q-item-section v-if="task.done" side>
          <q-btn
            @click.stop="deleteTask(index)"
            flat
            round
            dense
            color="primary"
            icon="delete"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <q-drawer
      v-model="drawer"
      side="right"
      overlay
      behavior="mobile"
      :width="325"
      :breakpoint="996">
      <q-card>
        <q-card-section class="q-mb-md">
          <q-input
            v-model="selectedTask.title"
            dense
            filled
            inverted
            light
            color="primary"></q-input>
          <q-checkbox
            v-model="selectedTask.done"
            :label="selectedTask.title"
            class="custom-checkbox"
            size="lg"
          ></q-checkbox>

          <div class="q-mb-md">
            <q-btn
              dense
              @click="toggleTag('Baja')"
              :color="selectedTask.tags.includes('Baja') ? 'red' : 'grey'"
              round icon="battery_0_bar"
              class="q-ml-md"
            ></q-btn>
            <q-btn
              dense
              @click="toggleTag('Alta')"
              :color="selectedTask.tags.includes('Alta') ? 'green' : 'grey'"
              round icon="battery_full"
              class="q-ml-md"
            ></q-btn>
            <q-btn
              dense
              @click="toggleTag('Estrella')"
              :color="selectedTask.tags.includes('Estrella') ? 'yellow' : 'grey'"
              round icon="star"
              class="q-ml-md"
            ></q-btn>
            <q-btn
              dense
              @click="toggleTag('Rapido')"
              :color="selectedTask.tags.includes('Rapido') ? 'primary' : 'grey'"
              round icon="timer_off"
              class="q-ml-md"
            ></q-btn>
            <q-btn
              dense
              @click="toggleTag('Demorado')"
              :color="selectedTask.tags.includes('Demorado') ? 'primary' : 'grey'"
              round icon="more_time"
              class="q-ml-md"
            ></q-btn>
          </div>

          <q-select
            v-model="selectedTask.linkedTasks"
            :options="taskOptions"
            label="Projects"
            multiple
            filled
            use-chips
            class="q-mb-md"
          ></q-select>

          <q-select
            v-model="selectedTask.linkedTasks"
            :options="taskOptions"
            label="Gaols"
            multiple
            filled
            use-chips
            class="q-mb-md"
          ></q-select>

          <q-select
            v-model="selectedTask.linkedTasks"
            :options="taskOptions"
            label="Focus Areas"
            multiple
            filled
            use-chips
            class="q-mb-md"
          ></q-select>

          <div class="" style="max-width: 300px">
            <q-input filled v-model="date">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="date" mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="date" mask="YYYY-MM-DD HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

        </q-card-section>
      </q-card>
    </q-drawer>

    <div
      v-if='!tasks.length'
      class="no-tasks absolute-center">
      <q-icon
        name="hub"
        size="100px"
        color="primary"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useQuasar } from 'quasar';

const tasks = ref([]);
const newTask = ref('');
const drawer = ref(false);
const selectedTask = ref({ tags: [] });
const $q = useQuasar();
const taskOptions = computed(() => tasks.value.map((task, index) => ({
  label: task.title,
  value: index,
})));

function deleteTask(index) {
  $q.dialog({
    title: 'Confirm Deletion',
    message: 'Are you sure you want to delete this task?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    tasks.value.splice(index, 1);
    $q.notify({ type: 'info', message: 'Task deleted successfully' });
  });
}

function addTask() {
  if (newTask.value.trim() !== '') {
    tasks.value.push({
      title: newTask.value,
      done: false,
      linkedTasks:
      [],
      tags: [],
    });
    newTask.value = '';
    $q.notify({ type: 'positive', message: 'Task added successfully' });
  } else {
    $q.notify({ type: 'warning', message: 'Please enter a task name' });
  }
}

function openTaskDetails(task) {
  if (!Array.isArray(task.linkedTasks)) {
    task.linkedTasks = [];
  }
  if (!Array.isArray(task.tags)) { // Make sure tags is always an array
    task.tags = [];
  }
  selectedTask.value = { ...task, linkedTasks: [...task.linkedTasks], tags: [...task.tags] };
  drawer.value = true;
}

function toggleTag(tag) {
  const index = selectedTask.value.tags.indexOf(tag);
  if (index === -1) {
    // Tag not present, add it
    selectedTask.value.tags.push(tag);
  } else {
    // Tag present, remove it
    selectedTask.value.tags.splice(index, 1);
  }
}

watch(selectedTask, (updatedTask) => {
  const taskIndex = tasks.value.findIndex((t) => t.title === updatedTask.title);
  if (taskIndex !== -1) {
    tasks.value[taskIndex] = { ...updatedTask };
  }
});
</script>

<style lang="scss">
  .done .q-item__label {
    text-decoration: line-through;
    color: #bbb;
  }
  .no-tasks {
    opacity: 0.5;
  }
  .custom-checkbox .q-checkbox__bg {
      border-radius: 50%;
      border-width: 2.5px;
      background-color: transparent;
  }
  .custom-checkbox .q-checkbox__svg {
    width: 12px !important;
    height: 12px !important;
    transform: translate(35%, 35%);
  }
</style>
