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
          :key="task.id"
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
          <q-item-section @click="openTaskDetails(task)">
            <span v-if="editingIndex !== index">{{ task.title }}</span>
            <q-input
              v-else
              v-model="task.title"
              @blur="endEdit(index)"
              @keyup.enter="endEdit(index)"
              autofocus
              dense
              size="lg"
              class="edit-input"
            ></q-input>
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
            <div @click.stop="startEditDrawer" class="align-center" >
              <q-checkbox
                v-model="selectedTask.done"
                class="custom-checkbox"
                size="lg"
              ></q-checkbox>
              <span
                v-if="!editingInDrawer"
                @click="startEditDrawer"
                class="editable-title"
                style="margin-left: 8px;"
              >{{ selectedTask.title }}</span>
              <q-input
                v-else
                v-model="selectedTask.title"
                @blur="endEditInDrawer"
                @keyup.enter="endEditInDrawer"
                autofocus
                dense
                size="lg"
                class="editable-input"
                style="margin-left: 8px;"
              ></q-input>
            </div>
            <div class="q-mb-md">
              <q-btn
                dense
                @click="toggleTagInSelectedTask('Baja')"
                :color="selectedTask.tags.includes('Baja') ? 'red' : 'grey'"
                round icon="battery_0_bar"
                class="q-ml-md"
              ></q-btn>
              <q-btn
                dense
                @click="toggleTagInSelectedTask('Alta')"
                :color="selectedTask.tags.includes('Alta') ? 'green' : 'grey'"
                round icon="battery_full"
                class="q-ml-md"
              ></q-btn>
              <q-btn
                dense
                @click="toggleTagInSelectedTask('Estrella')"
                :color="selectedTask.tags.includes('Estrella') ? 'yellow' : 'grey'"
                round icon="star"
                class="q-ml-md"
              ></q-btn>
              <q-btn
                dense
                @click="toggleTagInSelectedTask('Rapido')"
                :color="selectedTask.tags.includes('Rapido') ? 'primary' : 'grey'"
                round icon="timer_off"
                class="q-ml-md"
              ></q-btn>
              <q-btn
                dense
                @click="toggleTagInSelectedTask('Demorado')"
                :color="selectedTask.tags.includes('Demorado') ? 'primary' : 'grey'"
                round icon="more_time"
                class="q-ml-md"
              ></q-btn>
            </div>
            <q-select
              v-model="currentTaskIndex"
              :options="taskOptions"
              label="Select a task"
              multiple
              filled
              use-chips
              class="q-mb-md"
              @update:model-value="updateCurrentTaskIndex"
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
const editingIndex = ref(null);
const editingInDrawer = ref(false);
const drawer = ref(false);
const selectedTask = ref({
  id: '',
  title: '',
  done: false,
  tags: [],
  linkedTasks: [],
});
const $q = useQuasar();
const taskOptions = computed(() => tasks.value.map((task, index) => ({
  label: task.title,
  value: index,
})));
const currentTaskIndex = ref(null);

function startEditDrawer() {
  editingInDrawer.value = true;
}

function endEditInDrawer() {
  editingInDrawer.value = false;
  updateTaskInList();
}

function endEdit(index) {
  editingIndex.value = null;
  if (selectedTask.value.id === tasks.value[index].id) {
    selectedTask.value = { ...tasks.value[index] };
  }
}

function deleteTask(index) {
  $q.dialog({
    title: 'Confirm Deletion',
    message: 'Are you sure you want to delete this task?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    tasks.value.splice(index, 1);
    $q.notify({ type: 'info', message: 'Task deleted successfully' });
    if (selectedTask.value.id === tasks.value[index]?.id) {
      selectedTask.value = {
        id: '',
        title: '',
        done: false,
        tags: [],
        linkedTasks: [],
      };
    }
  });
}

function addTask() {
  if (newTask.value.trim() !== '') {
    const newId = Date.now().toString();
    tasks.value.push({
      id: newId,
      title: newTask.value,
      done: false,
      tags: [],
      linkedTasks: [],
    });
    newTask.value = '';
    $q.notify({ type: 'positive', message: 'Task added successfully' });
  } else {
    $q.notify({ type: 'warning', message: 'Please enter a task name' });
  }
}

function openTaskDetails(task) {
  drawer.value = true;
  selectedTask.value = { ...task };
}

function toggleTagInSelectedTask(tag) {
  const index = selectedTask.value.tags.indexOf(tag);
  if (index === -1) {
    selectedTask.value.tags.push(tag);
  } else {
    selectedTask.value.tags.splice(index, 1);
  }
}

watch(currentTaskIndex, (newIndex) => {
  if (newIndex !== null && tasks.value[newIndex]) {
    selectedTask.value = { ...tasks.value[newIndex] };
    drawer.value = true;
  }
});

watch(selectedTask, (newVal) => {
  const taskIndex = tasks.value.findIndex((task) => task.id === newVal.id);
  if (taskIndex !== -1) {
    tasks.value[taskIndex] = { ...newVal };
  }
}, { deep: true });

function updateTaskInList() {
  const taskIndex = tasks.value.findIndex((task) => task.id === selectedTask.value.id);
  if (taskIndex !== -1) {
    tasks.value[taskIndex] = { ...selectedTask.value };
  }
}

function updateCurrentTaskIndex(val) {
  currentTaskIndex.value = val;
}

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
    .edit-input {
    width: 100%;
    }
    .editable-title, .editable-input {
    display: inline-block;
    width: 200px;
    margin-left: 8px;
    word-wrap: break-word;
    white-space: normal;
    }
    .align-center {
    display: flex;
    align-items: center;
    }
</style>