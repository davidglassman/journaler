<template>
  <SettingsTheme />
  <SettingsSpacing />
  <SettingsFont />
  <SettingsLibrary />
</template>

<script setup lang="ts">
import SettingsFont from "@/components/settings/groups/font/SettingsFont.vue";
import SettingsLibrary from "@/components/settings/groups/library/SettingsLibrary.vue";
import SettingsSpacing from "@/components/settings/groups/spacing/SettingsSpacing.vue";
import SettingsTheme from "@/components/settings/groups/theme/SettingsTheme.vue";
</script>
