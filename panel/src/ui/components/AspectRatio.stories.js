import AspectRatio from "./AspectRatio.vue";
import Padding from "../storybook/Padding.js";

export default {
  title: "Layout / Aspect Ratio",
  component: AspectRatio,
  decorators: [Padding],
};

export const container = () => ({
  template: `
    <k-grid gutter="medium">
      <k-column width="1/4">
        <k-aspect-ratio ratio="4/5">
          <span class="flex items-center justify-center bg-pattern text-white">4/5</span>
        </k-aspect-ratio>
      </k-column>
      <k-column width="1/4">
        <k-aspect-ratio>
          <span class="flex items-center justify-center bg-pattern text-white">1/1</span>
        </k-aspect-ratio>
      </k-column>
      <k-column width="1/4">
        <k-aspect-ratio ratio="3/2">
          <span class="flex items-center justify-center bg-pattern text-white">3/2</span>
        </k-aspect-ratio>
      </k-column>
      <k-column width="1/4">
        <k-aspect-ratio ratio="3/1">
          <span class="flex items-center justify-center bg-pattern text-white">3/1</span>
        </k-aspect-ratio>
      </k-column>
    </k-grid>
  `,
});

export const image = () => ({
  template: `
    <k-grid gutter="medium">
      <k-column width="1/4">
        <k-aspect-ratio ratio="4/5">
          <img src="https://source.unsplash.com/user/erondu/1600x900" class="object-cover">
        </k-aspect-ratio>
      </k-column>
      <k-column width="1/4">
        <k-aspect-ratio>
          <img src="https://source.unsplash.com/user/erondu/1600x900" class="object-cover">
        </k-aspect-ratio>
      </k-column>
      <k-column width="1/4">
        <k-aspect-ratio ratio="3/2">
          <img src="https://source.unsplash.com/user/erondu/1600x900" class="object-cover">
        </k-aspect-ratio>
      </k-column>
      <k-column width="1/4">
        <k-aspect-ratio ratio="3/1">
          <img src="https://source.unsplash.com/user/erondu/1600x900" class="object-cover">
        </k-aspect-ratio>
      </k-column>
    </k-grid>
  `,
});

export const video = () => ({
  template: `
    <k-aspect-ratio ratio="16/9" class="bg-pattern">
      <iframe src="https://www.youtube.com/embed/vWGquxvqI_Y" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </k-aspect-ratio>
  `,
});

