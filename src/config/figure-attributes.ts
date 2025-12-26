import type { AnyAttributeDefinition } from "@/types/attributes";

// Default figure attributes configuration
// This would typically come from the template's customization config
export const defaultFigureAttributes: AnyAttributeDefinition[] = [
  {
    id: "attr_name",
    key: "name",
    label: "Name",
    type: "text_input",
    required: true,
    position: 0,
    config: {
      placeholder: "Enter name",
      maxLength: 15,
    },
  },
  {
    id: "attr_body",
    key: "bodyId",
    label: "Body Type",
    type: "select",
    required: true,
    position: 1,
    config: {
      dataSource: "bodies",
      displayMode: "buttons",
      filterByGender: false, // This is the base, don't filter it
    },
  },
  {
    id: "attr_hair",
    key: "hairId",
    label: "Hair Style",
    type: "select",
    required: true,
    position: 2,
    config: {
      dataSource: "hairs",
      displayMode: "grid",
      columns: 3,
      filterByGender: true, // Filter based on body gender
    },
  },
  {
    id: "attr_outfit",
    key: "outfitId",
    label: "Outfit",
    type: "select",
    required: true,
    position: 3,
    config: {
      dataSource: "outfits",
      displayMode: "grid",
      columns: 2,
      filterByGender: true,
    },
  },
  {
    id: "attr_skin_color",
    key: "skinColorId",
    label: "Skin Tone",
    type: "color_picker",
    required: true,
    position: 4,
    config: {
      dataSource: "skinColors",
    },
  },
  {
    id: "attr_hair_color",
    key: "hairColorId",
    label: "Hair Color",
    type: "color_picker",
    required: true,
    position: 5,
    config: {
      dataSource: "hairColors",
    },
  },
  {
    id: "attr_outfit_color",
    key: "outfitColorId",
    label: "Outfit Color",
    type: "color_picker",
    required: true,
    position: 6,
    config: {
      dataSource: "outfitColors",
    },
  },
  {
    id: "attr_accessories",
    key: "accessoryIds",
    label: "Accessories",
    type: "image_picker",
    required: false,
    position: 7,
    config: {
      dataSource: "accessories",
      multiple: true,
      maxItems: 3,
    },
  },
];

// Example: Custom attributes for a different template
export const familyPortraitAttributes: AnyAttributeDefinition[] = [
  {
    id: "attr_name",
    key: "name",
    label: "Name",
    type: "text_input",
    required: true,
    position: 0,
    config: {
      placeholder: "Enter family member name",
      maxLength: 20,
    },
  },
  {
    id: "attr_role",
    key: "role",
    label: "Family Role",
    type: "select",
    required: true,
    position: 1,
    config: {
      dataSource: "familyRoles",
      displayMode: "buttons",
      filterByGender: false,
    },
  },
  {
    id: "attr_body",
    key: "bodyId",
    label: "Body Type",
    type: "select",
    required: true,
    position: 2,
    config: {
      dataSource: "bodies",
      displayMode: "buttons",
      filterByGender: false,
    },
  },
  // ... more attributes
];
