// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Checkbox } from '.';

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = {
  args: {
    label: 'Unchecked',
  },
};
