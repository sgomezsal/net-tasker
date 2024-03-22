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
        <q-card-section>
          <q-checkbox
            v-model="selectedTask.done"
            :label="selectedTask.title"
            class="q-mb-md custom-checkbox"
            size="lg"
          ></q-checkbox>
          <q-input
            v-model="selectedTask.tags"
            label="Tags"
            filled
            class="q-mb-md"
          ></q-input>
          <q-date
            v-model="selectedTask.date"
            mask="YYYY-MM-DD"
            class="q-mb-md"></q-date>
          <q-select
            v-model="selectedTask.linkedTasks"
            :options="taskOptions"
            label="Link tasks"
            multiple
            filled
            use-chips
            class="q-mb-md"
          ></q-select>
        </q-card-section>
      </q-card>
    </q-drawer>

    <div
      v-if='!tasks.length'
      class="no-tasks absolute-center">
      <q-icon
        name="hub"
        size="100px"
        color="primary"/>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useQuasar } from 'quasar';

const tasks = ref([
  // { title: 'Task 1', done: false, linkedTasks: [] },
]);
const newTask = ref('');
const drawer = ref(false);
const selectedTask = ref({});
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
      linkedTasks: [],
    });
    newTask.value = '';
  } else {
    $q.notify({ type: 'warning', message: 'Please enter a task name' });
  }
}

function openTaskDetails(task) {
  if (!Array.isArray(task.linkedTasks)) {
    task.linkedTasks = [];
  }
  selectedTask.value = { ...task, linkedTasks: [...task.linkedTasks] };
  drawer.value = true;
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
