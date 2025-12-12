# Toast Notification Implementation - Usage Examples

## Overview

The toast notification system uses a **hybrid approach** combining:
- **Custom Tailwind classes** for consistent, accessible styling
- **Svelte transitions** for smooth, performant animations
- **Standardized server responses** for automatic toast triggering

## Architecture

### Components
- **[src/lib/constants/toastStyles.ts](src/lib/constants/toastStyles.ts)** - Toast style definitions
- **[src/components/page/Toast.svelte](src/components/page/Toast.svelte)** - Individual toast component
- **[src/components/page/Toasts.svelte](src/components/page/Toasts.svelte)** - Toast container
- **[src/stores/toaststore.ts](src/stores/toaststore.ts)** - Toast state management

### Server Response Format

All server actions return consistent responses:

```typescript
// Success
{
  success: true,
  message: string,
  data?: any
}

// Error (using fail())
return fail(statusCode, {
  success: false,
  message: string,
  errors?: { [field: string]: string }
});
```

## Client-Side Usage

### Basic Usage in Components

```svelte
<script lang="ts">
  import { toastStore } from '$stores/toaststore';
  import { enhance } from '$app/forms';

  let form: HTMLFormElement;
</script>

<form method="POST" action="?/assignRole" use:enhance bind:this={form}>
  <!-- Form fields -->
  <button type="submit">Assign Role</button>
</form>
```

### Manual Toast Triggering

For client-side events or custom logic:

```typescript
import { toastStore } from '$stores/toaststore';

// Success toast
toastStore.add({
  type: 'success',
  message: 'Role assigned successfully'
});

// Error toast
toastStore.add({
  type: 'error',
  message: 'Failed to assign role'
});

// Warning toast
toastStore.add({
  type: 'warning',
  message: 'Session will expire in 5 minutes'
});

// Info toast
toastStore.add({
  type: 'info',
  message: 'New update available'
});
```

### Enhanced Form Actions with Custom Handling

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  import { toastStore } from '$stores/toaststore';
  import type { SubmitFunction } from '@sveltejs/kit';

  const handleSubmit: SubmitFunction = () => {
    return async ({ result, update }) => {
      if (result.type === 'success' && result.data) {
        // Server response automatically triggers toast
        await update();
      } else if (result.type === 'failure') {
        // Optionally add custom handling for specific errors
        if (result.data?.errors) {
          // Handle field-specific errors
          console.error('Field errors:', result.data.errors);
        }
        await update();
      }
    };
  };
</script>

<form method="POST" action="?/saveData" use:enhance={handleSubmit}>
  <!-- Form content -->
</form>
```

### Programmatic Dismissal

```typescript
import { toastStore } from '$stores/toaststore';

// Add a toast and save its ID
const toastId = toastStore.add({
  type: 'info',
  message: 'Processing your request...'
});

// Later, dismiss it when done
toastStore.remove(toastId);

// Or clear all toasts
toastStore.clear();
```

## Server-Side Implementation

### Standard Form Action Pattern

```typescript
// src/routes/(protected)/admin/site/roles/assignments/+page.server.ts
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  assignRole: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const userId = formData.get('user_id');
    const roleId = formData.get('role_id');

    // Validation
    if (!userId || !roleId) {
      return fail(400, {
        success: false,
        message: 'User ID and Role ID are required'
      });
    }

    // Get names for better message
    const { data: user } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();

    const { data: role } = await supabase
      .from('roles')
      .select('name')
      .eq('id', roleId)
      .single();

    // Perform action
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role_id: roleId });

    if (error) {
      return fail(400, {
        success: false,
        message: `Failed to assign role: ${error.message}`
      });
    }

    // Success - descriptive message
    return {
      success: true,
      message: `Role '${role.name}' assigned to ${user.full_name} successfully`
    };
  }
};
```

### Returning Data with Success

```typescript
export const actions: Actions = {
  validateAddress: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const address = formData.get('address');

    const { data, error } = await supabase.rpc('validate_address', {
      address_text: address
    });

    if (error) {
      return fail(500, {
        success: false,
        message: 'Failed to validate address'
      });
    }

    return {
      success: true,
      message: 'Address validated successfully',
      data: data // Available in form result
    };
  }
};
```

### Field-Specific Errors

```typescript
export const actions: Actions = {
  createUser: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    // Validation
    const errors: Record<string, string> = {};

    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    if (password && password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (Object.keys(errors).length > 0) {
      return fail(400, {
        success: false,
        message: 'Please fix the errors below',
        errors
      });
    }

    // Create user
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return fail(400, {
        success: false,
        message: error.message
      });
    }

    return {
      success: true,
      message: 'User created successfully'
    };
  }
};
```

## Styling Customization

### Modifying Toast Styles

Edit [src/lib/constants/toastStyles.ts](src/lib/constants/toastStyles.ts):

```typescript
export const TOAST_STYLES: Record<ToastType, ToastStyles> = {
  success: {
    // Change background, border, text colors
    container: 'bg-emerald-600 border-l-4 border-emerald-900 text-white shadow-xl',
    icon: 'text-emerald-50',
    closeButton: 'text-emerald-100 hover:text-white hover:bg-emerald-700'
  },
  // ... other types
};
```

### Adjusting Animations

Edit [src/components/page/Toast.svelte](src/components/page/Toast.svelte):

```svelte
<div
  in:fly={{ x: 300, duration: 300, easing: quintOut }}  <!-- Slower entrance -->
  out:fly={{ x: 300, duration: 100, easing: quintOut }} <!-- Faster exit -->
>
```

Available easing functions from `svelte/easing`:
- `quintOut` (default) - Smooth deceleration
- `elasticOut` - Bouncy effect
- `backOut` - Slight overshoot
- `cubicOut` - Gentle curve

### Positioning

Edit [src/components/page/Toasts.svelte](src/components/page/Toasts.svelte):

```svelte
<!-- Top-right (default) -->
<div class="fixed top-4 right-4 z-50 ...">

<!-- Top-center -->
<div class="fixed top-4 left-1/2 -translate-x-1/2 z-50 ...">

<!-- Bottom-right -->
<div class="fixed bottom-4 right-4 z-50 ...">

<!-- Bottom-left -->
<div class="fixed bottom-4 left-4 z-50 ...">
```

## Accessibility Features

### Built-in Accessibility

The toast system includes:
- **ARIA live regions** - Screen readers announce toasts
  - `aria-live="assertive"` for errors (immediate announcement)
  - `aria-live="polite"` for success/info/warning (wait for pause)
- **Keyboard navigation** - Close button is focusable
- **Color contrast** - WCAG AAA compliant
- **Focus management** - Proper focus ring on close button
- **Semantic HTML** - Proper roles and labels

### Testing Accessibility

```bash
# Run accessibility tests
npm run test:a11y

# Or manually test with screen reader:
# - macOS: VoiceOver (Cmd+F5)
# - Windows: NVDA (free) or JAWS
# - Linux: Orca
```

## Advanced Patterns

### Auto-dismiss with Custom Duration

```typescript
// Add to toaststore.ts if not already implemented
toastStore.add({
  type: 'success',
  message: 'File uploaded successfully',
  duration: 5000 // 5 seconds
});
```

### Persistent Toast (No Auto-dismiss)

```typescript
const criticalToastId = toastStore.add({
  type: 'error',
  message: 'Critical error - manual dismissal required',
  duration: Infinity // Never auto-dismiss
});

// Manually dismiss later
toastStore.remove(criticalToastId);
```

### Progressive Enhancement

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';

  // Works without JavaScript (server redirects)
  // Enhanced with JavaScript (toast notifications)
</script>

<form method="POST" use:enhance>
  <!-- Form content -->
</form>
```

## Testing

### Unit Testing Toast Store

```typescript
import { describe, it, expect } from 'vitest';
import { get } from 'svelte/store';
import { toastStore } from '$stores/toaststore';

describe('Toast Store', () => {
  it('should add toast', () => {
    const id = toastStore.add({
      type: 'success',
      message: 'Test message'
    });

    const toasts = get(toastStore);
    expect(toasts).toHaveLength(1);
    expect(toasts[0].message).toBe('Test message');
  });

  it('should remove toast', () => {
    const id = toastStore.add({
      type: 'info',
      message: 'Test'
    });

    toastStore.remove(id);

    const toasts = get(toastStore);
    expect(toasts).toHaveLength(0);
  });
});
```

### Integration Testing with Forms

```typescript
import { render, fireEvent } from '@testing-library/svelte';
import YourComponent from './YourComponent.svelte';

it('shows success toast on form submit', async () => {
  const { getByRole, findByRole } = render(YourComponent);

  const submitButton = getByRole('button', { name: /submit/i });
  await fireEvent.click(submitButton);

  const toast = await findByRole('alert');
  expect(toast).toHaveTextContent('Success message');
});
```

## Performance Considerations

### Optimization Tips

1. **Limit simultaneous toasts** - Maximum 3-5 visible at once
2. **Auto-dismiss** - Use reasonable durations (3-5 seconds)
3. **Transition performance** - Svelte transitions run on compositor
4. **Z-index management** - Fixed at `z-50` to avoid conflicts

### Monitoring Toast Usage

```typescript
// Add to toaststore.ts for debugging
if (import.meta.env.DEV) {
  toastStore.subscribe(toasts => {
    console.log('Active toasts:', toasts.length);
  });
}
```

## Troubleshooting

### Common Issues

**Toast not appearing:**
- Check that `<Toasts />` is in root layout
- Verify server action returns correct format
- Check browser console for errors

**Toast stays forever:**
- Ensure auto-dismiss is implemented in store
- Check that duration is set correctly

**Styling issues:**
- Verify Tailwind classes are not purged
- Check z-index conflicts
- Ensure dark mode compatibility

**Accessibility warnings:**
- Verify aria-live regions are present
- Check color contrast ratios
- Test with screen reader

## Migration Guide

If you have existing toast implementations:

1. Update server actions to use standard response format
2. Replace custom toast components with new Toast.svelte
3. Update imports to use toastStore
4. Test all form actions
5. Verify accessibility with screen reader

## Additional Resources

- [SvelteKit Form Actions](https://kit.svelte.dev/docs/form-actions)
- [Svelte Transitions](https://svelte.dev/docs/svelte-transition)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Live Regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)
