<template>
  <SettingsGroup name="Font">
    <!-- Font Size -->

    <SettingsItem name="Font Size">
      <SettingsFontSize />
    </SettingsItem>
  </SettingsGroup>
</template>

<script setup lang="ts">
import SettingsFontSize from "@/components/settings/groups/font/SettingsFontSize.vue";
import SettingsGroup from "@/components/settings/groups/SettingsGroup.vue";
import SettingsItem from "@/components/settings/groups/SettingsItem.vue";
</script>

<style scoped></style>
