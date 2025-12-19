<template>
  <SettingsGroup name="Spacing">
    <!-- Text Width -->

    <SettingsItem name="Text Width">
      <SettingsTextWidth />
    </SettingsItem>

    <!-- Paragraph Spacing -->

    <SettingsItem name="Paragraph Spacing">
      <SettingsParagraphSpacing />
    </SettingsItem>
  </SettingsGroup>
</template>

<script setup lang="ts">
import SettingsGroup from "@/components/settings/groups/SettingsGroup.vue";
import SettingsItem from "@/components/settings/groups/SettingsItem.vue";
import SettingsParagraphSpacing from "@/components/settings/groups/spacing/SettingsParagraphSpacing.vue";
import SettingsTextWidth from "@/components/settings/groups/spacing/SettingsTextWidth.vue";
</script>

<style scoped></style>
