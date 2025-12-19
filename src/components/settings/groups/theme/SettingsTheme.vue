<template>
  <SettingsGroup name="Theme">
    <!-- Light / Dark Mode -->

    <SettingsItem name="Light/Dark Mode">
      <SettingsLightDarkMode />
    </SettingsItem>

    <!-- Accent Color -->

    <SettingsItem name="Accent Color">
      <SettingsAccentColor />
    </SettingsItem>
  </SettingsGroup>
</template>

<script setup lang="ts">
import SettingsGroup from "@/components/settings/groups/SettingsGroup.vue";
import SettingsItem from "@/components/settings/groups/SettingsItem.vue";
import SettingsAccentColor from "@/components/settings/groups/theme/SettingsAccentColor.vue";
import SettingsLightDarkMode from "@/components/settings/groups/theme/SettingsLightDarkMode.vue";
</script>

<style scoped></style>
