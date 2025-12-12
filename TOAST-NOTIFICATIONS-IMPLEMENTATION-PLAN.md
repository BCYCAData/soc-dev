# Toast Notifications Implementation Plan

**Generated:** 2025-12-09
**Status:** Ready for Implementation
**Owner:** Development Team

---

## Executive Summary

This plan outlines the implementation of a comprehensive toast notification system for the SOC Dev Admin application. Currently, the application has **no toast notification library** and relies on inline messages and dialogs for user feedback. This implementation will provide users with clear, accessible, and non-intrusive feedback for all form actions and operations.

**Scope:** 30+ buttons across authentication, admin operations, messaging, spatial data, and event management
**Estimated Timeline:** 5-6 days
**Implementation Approach:** Custom Svelte store + component (recommended over third-party libraries)

---

## Current State Analysis

### Existing Feedback Mechanisms

1. **Inline Messages (Component-Based)**
   - [AuthErrorMessage.svelte](src/components/form/auth/AuthErrorMessage.svelte)
   - [AuthSuccessMessage.svelte](src/components/form/auth/AuthSuccessMessage.svelte)
   - [ValidationMessage.svelte](src/components/form/auth/ValidationMessage.svelte)
   - **Limitation:** Static, requires component placement, not dismissible

2. **Panel Messages (State-Driven)**
   - [AllUsersPanel.svelte](src/components/form/panels/AllUsersPanel.svelte):20-21, 32-38
   - [IndividualUsersPanel.svelte](src/components/form/panels/IndividualUsersPanel.svelte)
   - [MessagesActionPanel.svelte](src/components/form/panels/MessagesActionPanel.svelte)
   - **Pattern:** `successMessage`/`errorMessage` state with exported setter functions
   - **Limitation:** Panel-specific, not reusable

3. **Confirmation Dialogs**
   - [ConfirmDialogue.svelte](src/components/page/modals/ConfirmDialogue.svelte)
   - **Usage:** High-impact operations (delete, revoke, bulk actions)
   - **Note:** These should remain for destructive actions

4. **Loading States**
   - [Spinner.svelte](src/components/page/Spinner.svelte)
   - [loadingstore.ts](src/stores/loadingstore.ts) - Global loading state
   - **Status:** Being implemented per FORM-BUTTONS-TO-FIX.md

### What's Missing

- ✗ No toast notification system
- ✗ No success feedback for operations
- ✗ No consistent error messaging
- ✗ No auto-dismissing notifications
- ✗ No notification queue/stacking

---

## Implementation Architecture

### Option A: Custom Svelte Store (RECOMMENDED) ⭐

**Why Custom?**
- Matches existing store patterns ([loadingstore.ts](src/stores/loadingstore.ts), [helpstore.ts](src/stores/helpstore.ts))
- Zero external dependencies
- Full control over styling and behavior
- Lightweight (~100 lines of code)
- Integrates seamlessly with Skeleton Labs design system

**Architecture:**

```
src/
├── stores/
│   └── toaststore.ts          # Toast state management
├── components/
│   └── page/
│       └── Toasts.svelte      # Toast display component
└── routes/
    └── +layout.svelte         # Root layout (add Toasts component)
```

### Option B: Third-Party Library (Alternative)

**Libraries Considered:**
1. **svelte-sonner** - Modern, headless, accessible
2. **svelte-french-toast** - Lightweight, proven
3. **@skeletonlabs/skeleton Alert** - Already installed

**Recommendation:** Stick with Option A (custom) for better control and consistency.

---

## Technical Implementation

### Phase 0: Foundation (Day 1 - Morning)

#### 1. Create Toast Store

**File:** [src/stores/toaststore.ts](src/stores/toaststore.ts) (NEW)

```typescript
import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  dismissible?: boolean;
}

interface ToastStore {
  toasts: Toast[];
}

function createToastStore() {
  const { subscribe, update } = writable<ToastStore>({ toasts: [] });

  function addToast(type: ToastType, message: string, duration = 5000) {
    const id = `toast-${Date.now()}-${Math.random()}`;

    update((state) => ({
      toasts: [...state.toasts, { id, type, message, duration, dismissible: true }]
    }));

    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }

    return id;
  }

  function dismiss(id: string) {
    update((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  }

  function clear() {
    update(() => ({ toasts: [] }));
  }

  return {
    subscribe,
    success: (message: string, duration?: number) => addToast('success', message, duration),
    error: (message: string, duration?: number) => addToast('error', message, duration),
    warning: (message: string, duration?: number) => addToast('warning', message, duration),
    info: (message: string, duration?: number) => addToast('info', message, duration),
    dismiss,
    clear
  };
}

export const toast = createToastStore();
```

#### 2. Create Toast Display Component

**File:** [src/components/page/Toasts.svelte](src/components/page/Toasts.svelte) (NEW)

```svelte
<script lang="ts">
  import { toast } from '$stores/toaststore';
  import { fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-svelte';

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const iconStyles = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  };
</script>

<div
  class="fixed top-4 right-4 z-50 flex flex-col gap-2 w-96 max-w-[calc(100vw-2rem)]"
  aria-live="polite"
  aria-atomic="true"
>
  {#each $toast.toasts as toastItem (toastItem.id)}
    <div
      animate:flip={{ duration: 200 }}
      in:fly={{ x: 300, duration: 200 }}
      out:fly={{ x: 300, duration: 200 }}
      class="flex items-start gap-3 p-4 rounded-lg border shadow-lg {styles[toastItem.type]}"
      role="alert"
    >
      <svelte:component
        this={icons[toastItem.type]}
        size={20}
        class="shrink-0 {iconStyles[toastItem.type]}"
      />

      <p class="flex-1 text-sm font-medium">
        {toastItem.message}
      </p>

      {#if toastItem.dismissible}
        <button
          type="button"
          onclick={() => toast.dismiss(toastItem.id)}
          class="shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Dismiss notification"
        >
          <X size={16} />
        </button>
      {/if}
    </div>
  {/each}
</div>
```

#### 3. Add to Root Layout

**File:** [src/routes/+layout.svelte](src/routes/+layout.svelte) (EDIT)

Add the Toasts component to render on all pages:

```svelte
<script lang="ts">
  import Toasts from '$components/page/Toasts.svelte';
  // ... existing imports
</script>

<Toasts />

<!-- existing layout content -->
```

---

### Phase 1: Critical Auth & User Management (Day 1 - Afternoon + Day 2)

**Priority:** 🔴 CRITICAL
**Risk:** High - Double submissions, duplicate accounts/assignments

#### 1.1 Create Account Forms (2 buttons)

**Files:**
- [src/components/form/address-challenge/AddressValid.svelte](src/components/form/address-challenge/AddressValid.svelte):71
- [src/components/form/address-challenge/AddressUnchallenged.svelte](src/components/form/address-challenge/AddressUnchallenged.svelte):81

**Implementation:**

```svelte
<script lang="ts">
  import { toast } from '$stores/toaststore';
  import { enhance } from '$app/forms';

  let isSubmitting = false;
</script>

<form
  method="POST"
  use:enhance={() => {
    isSubmitting = true;

    return async ({ result, update }) => {
      if (result.type === 'success') {
        toast.success('Account created successfully! Please check your email to verify.');
      } else if (result.type === 'error') {
        toast.error(result.error?.message || 'Failed to create account. Please try again.');
      } else if (result.type === 'failure') {
        toast.error('Failed to create account. Please check the form and try again.');
      }
      await update();
      isSubmitting = false;
    };
  }}
>
  <!-- form fields -->

  <button type="submit" disabled={!canGo || isSubmitting}>
    {#if isSubmitting}
      Creating Account...
    {:else}
      Create Account
    {/if}
  </button>
</form>
```

**Toast Messages:**
- ✅ Success: "Account created successfully! Please check your email to verify."
- ❌ Error: "Failed to create account. Please try again."

#### 1.2 KYNG Coordinator Management (2 buttons)

**Files:**
- [src/routes/(protected)/admin/users/kyng-coordinators/+page.svelte](src/routes/(protected)/admin/users/kyng-coordinators/+page.svelte):172 (Assign)
- [src/routes/(protected)/admin/users/kyng-coordinators/+page.svelte](src/routes/(protected)/admin/users/kyng-coordinators/+page.svelte):301 (Update)

**Implementation Pattern:**

```svelte
use:enhance={() => {
  isAssigning = true;

  return async ({ result, update }) => {
    if (result.type === 'success') {
      toast.success('KYNG Coordinator assigned successfully');
      // Clear form
      selectedUser = null;
      selectedKYNG = null;
    } else {
      toast.error('Failed to assign coordinator. Please try again.');
    }
    await update();
    isAssigning = false;
  };
}}
```

**Toast Messages:**
- ✅ Success (Assign): "KYNG Coordinator assigned successfully"
- ✅ Success (Update): "Coordinator details updated successfully"
- ❌ Error: "Failed to assign/update coordinator. Please try again."

**Server-Side Updates Required:**

**File:** [src/routes/(protected)/admin/users/kyng-coordinators/+page.server.ts](src/routes/(protected)/admin/users/kyng-coordinators/+page.server.ts)

Add structured return messages:

```typescript
export const actions: Actions = {
  assignCoordinator: async ({ request, locals: { supabase, permissions } }) => {
    // ... existing validation

    const { error: assignError } = await supabase
      .from('kyng_coordinators')
      .insert({ user_id, kyng_id });

    if (assignError) {
      return fail(400, {
        success: false,
        message: 'Failed to assign coordinator: ' + assignError.message
      });
    }

    return { success: true, message: 'KYNG Coordinator assigned successfully' };
  }
};
```

---

### Phase 2: Important Admin Operations (Days 2-3)

**Priority:** 🟡 IMPORTANT
**Impact:** Medium - Duplicate operations, unclear feedback

#### 2.1 Role & Permission Management (4 buttons)

**Files:**
- [src/routes/(protected)/admin/site/roles/assignments/+page.svelte](src/routes/(protected)/admin/site/roles/assignments/+page.svelte):104 (Assign Role)
- [src/routes/(protected)/admin/site/roles/permissions/+page.svelte](src/routes/(protected)/admin/site/roles/permissions/+page.svelte):94 (Delete Role)
- [src/routes/(protected)/admin/site/roles/permissions/+page.svelte](src/routes/(protected)/admin/site/roles/permissions/+page.svelte):118 (Update Permissions)
- [src/routes/(protected)/admin/site/roles/permissions/+page.svelte](src/routes/(protected)/admin/site/roles/permissions/+page.svelte):219 (Add New Role)

**Toast Messages:**
- ✅ "Role '{roleName}' assigned to {userName} successfully"
- ✅ "Role '{roleName}' deleted successfully"
- ✅ "Permissions updated for '{roleName}'"
- ✅ "New role '{roleName}' created successfully"
- ❌ "Failed to assign/delete/update role"

**Special Consideration - Delete Role:**
This button already needs a confirmation dialog (per FORM-BUTTONS-TO-FIX.md line 130).

**Implementation:**

```svelte
<script>
  import ConfirmDialogue from '$components/page/modals/ConfirmDialogue.svelte';

  let showDeleteConfirm = false;
  let roleToDelete = null;

  function handleDeleteClick(role) {
    roleToDelete = role;
    showDeleteConfirm = true;
  }

  async function confirmDelete() {
    // Perform delete via form action
    // Show toast on success/error
  }
</script>

<ConfirmDialogue
  isOpen={showDeleteConfirm}
  title="Delete Role"
  message="Are you sure you want to delete the role '{roleToDelete?.name}'? This action cannot be undone."
  variant="danger"
  onConfirm={confirmDelete}
  onCancel={() => showDeleteConfirm = false}
/>
```

#### 2.2 Message Operations (3 buttons)

**Files:**
- [src/components/form/panels/MessagesActionPanel.svelte](src/components/form/panels/MessagesActionPanel.svelte):103 (Revoke)
- [src/components/form/panels/AllUsersPanel.svelte](src/components/form/panels/AllUsersPanel.svelte):62 (Send to All)
- [src/components/form/panels/IndividualUsersPanel.svelte](src/components/form/panels/IndividualUsersPanel.svelte):64 (Send to Selected)

**Toast Messages:**
- ✅ "Message sent to all users successfully"
- ✅ "Message sent to {count} selected users"
- ✅ "{count} messages revoked successfully"
- ❌ "Failed to send message. Please try again."
- ❌ "Failed to revoke messages. Please try again."

**Implementation Pattern:**

```svelte
use:enhance={() => {
  isSending = true;

  return async ({ result, update }) => {
    if (result.type === 'success') {
      const count = result.data?.count || selectedUsers.length;
      toast.success(`Message sent to ${count} user${count !== 1 ? 's' : ''} successfully`);
      // Clear form
      messageContent = '';
      selectedUsers = [];
    } else {
      toast.error('Failed to send message. Please try again.');
    }
    await update();
    isSending = false;
  };
}}
```

**Server-Side Updates:**

Return count information for better toast messages:

```typescript
return {
  success: true,
  count: insertedMessages.length,
  message: `Message sent to ${insertedMessages.length} users`
};
```

#### 2.3 Spatial Data Management (2 buttons)

**Files:**
- [src/routes/(protected)/admin/site/data/spatial/+page.svelte](src/routes/(protected)/admin/site/data/spatial/+page.svelte):148 (Update Template)
- [src/routes/(protected)/admin/site/data/spatial/+page.svelte](src/routes/(protected)/admin/site/data/spatial/+page.svelte):225 (Create Template)

**Toast Messages:**
- ✅ "Template '{templateName}' updated successfully"
- ✅ "New template '{templateName}' created successfully"
- ❌ "Failed to update/create template"

---

### Phase 3: Tables & Modals (Days 3-4)

**Priority:** 🟢 LOWER
**Impact:** Low-Medium - Quick actions benefit from feedback

#### 3.1 Table Row Actions (2 buttons)

**Files:**
- [src/components/form/tables/RolesTable.svelte](src/components/form/tables/RolesTable.svelte):46 (Remove Role)
- [src/components/form/tables/CurrentKYNGCoordinatorsTable.svelte](src/components/form/tables/CurrentKYNGCoordinatorsTable.svelte):119 (Revoke Coordinator)

**Toast Messages:**
- ✅ "Role removed from user successfully"
- ✅ "Coordinator access revoked successfully"
- ❌ "Failed to remove role/revoke access"

**Note:** Both actions should have confirmation dialogs before proceeding.

#### 3.2 Address Management (3 buttons)

**Files:**
- [src/components/form/custom-addresses/CustomAddressValidationForm.svelte](src/components/form/custom-addresses/CustomAddressValidationForm.svelte):88
- [src/components/form/GNAFAddressCheckForm.svelte](src/components/form/GNAFAddressCheckForm.svelte):68
- [src/components/page/tabs/addresses/CustomAddressManagementTab.svelte](src/components/page/tabs/addresses/CustomAddressManagementTab.svelte):236

**Toast Messages:**
- ✅ "Address validated successfully"
- ℹ️ "Address not found in GNAF database"
- ✅ "Custom address added successfully"

#### 3.3 Add Property Modal (1 button)

**File:** [src/components/page/modals/AddPropertyModal.svelte](src/components/page/modals/AddPropertyModal.svelte):193

**Toast Messages:**
- ✅ "Property added successfully"
- ❌ "Failed to add property. Please check the form."

**Implementation:**

```svelte
use:enhance={() => {
  isSubmitting = true;

  return async ({ result, update }) => {
    if (result.type === 'success') {
      toast.success('Property added successfully');
      // Close modal
      dispatch('close');
    } else {
      toast.error('Failed to add property. Please check the form.');
    }
    await update();
    isSubmitting = false;
  };
}}
```

#### 3.4 Location Selectors (4 buttons)

**File:** [src/components/form/inputs/LocationBasedSelectors.svelte](src/components/form/inputs/LocationBasedSelectors.svelte):54, 95, 131, 167

**Implementation:** These are filter forms, may not need toasts (just loading states).

---

### Phase 4: Map & Events (Days 4-5)

#### 4.1 Map Editor Operations (3 buttons)

**Files:**
- [src/components/map/leaflet/controls/LeafletGeoJSONDeleteEditor.svelte](src/components/map/leaflet/controls/LeafletGeoJSONDeleteEditor.svelte):127
- [src/components/map/leaflet/controls/LeafletGeoJSONAttributeEditor.svelte](src/components/map/leaflet/controls/LeafletGeoJSONAttributeEditor.svelte):292 (Create)
- [src/components/map/leaflet/controls/LeafletGeoJSONAttributeEditor.svelte](src/components/map/leaflet/controls/LeafletGeoJSONAttributeEditor.svelte):295 (Update)

**Toast Messages:**
- ✅ "GeoJSON feature deleted successfully"
- ✅ "Attribute created successfully"
- ✅ "Attribute updated successfully"
- ❌ "Failed to delete/create/update GeoJSON"

**Special Note - Delete:** MUST have confirmation dialog (destructive action).

#### 4.2 Event Management (4 buttons)

**Files:**
- [src/routes/(protected)/admin/community/bcyca/events/+page.svelte](src/routes/(protected)/admin/community/bcyca/events/+page.svelte):170
- [src/routes/(protected)/admin/community/mondrook/events/+page.svelte](src/routes/(protected)/admin/community/mondrook/events/+page.svelte):170
- [src/routes/(protected)/admin/community/tinonee/events/+page.svelte](src/routes/(protected)/admin/community/tinonee/events/+page.svelte):170
- [src/routes/(protected)/admin/community/external/events/+page.svelte](src/routes/(protected)/admin/community/external/events/+page.svelte):170

**Toast Messages:**
- ✅ "Event '{eventTitle}' created successfully"
- ❌ "Failed to create event. Please check the form."

**Implementation Pattern:**

```svelte
use:enhance={() => {
  isSubmitting = true;

  return async ({ result, update }) => {
    if (result.type === 'success') {
      const eventTitle = result.data?.title || 'Event';
      toast.success(`Event '${eventTitle}' created successfully`);
      // Clear form
      resetForm();
    } else {
      toast.error('Failed to create event. Please check the form.');
    }
    await update();
    isSubmitting = false;
  };
}}
```

---

### Phase 5: Polish & Testing (Day 5-6)

#### 5.1 Accessibility Enhancements

**Requirements:**
- ✓ ARIA live regions (`aria-live="polite"`)
- ✓ Screen reader announcements
- ✓ Keyboard navigation (Escape to dismiss)
- ✓ Focus management (don't trap focus)
- ✓ Color contrast compliance (WCAG AA)

**Testing:**
- Test with screen readers (NVDA/JAWS on Windows, VoiceOver on macOS)
- Keyboard-only navigation
- High contrast mode

#### 5.2 Animation & UX Polish

**Enhancements:**
- ✓ Smooth enter/exit transitions (svelte/transition)
- ✓ Toast stacking with proper spacing
- ✓ Progress bar for auto-dismiss (optional)
- ✓ Pause auto-dismiss on hover (optional)
- ✓ Mobile responsiveness (max-width, positioning)

#### 5.3 Error Handling

**Edge Cases:**
- ✓ Maximum toast count (limit to 5 simultaneous toasts)
- ✓ Rapid successive toasts (queue management)
- ✓ Very long messages (truncation with "Read more")
- ✓ Network errors (generic fallback messages)

#### 5.4 Server Action Standardization

**Create Helper Function:**

**File:** [src/lib/server/utils/actionResponse.ts](src/lib/server/utils/actionResponse.ts) (NEW)

```typescript
export function successResponse(message: string, data?: any) {
  return {
    success: true,
    message,
    ...data
  };
}

export function errorResponse(message: string, status = 400, data?: any) {
  return fail(status, {
    success: false,
    message,
    ...data
  });
}
```

**Usage in Server Actions:**

```typescript
import { successResponse, errorResponse } from '$lib/server/utils/actionResponse';

export const actions: Actions = {
  assignRole: async ({ request, locals }) => {
    // ... validation and logic

    if (error) {
      return errorResponse('Failed to assign role: ' + error.message);
    }

    return successResponse('Role assigned successfully', { roleName, userName });
  }
};
```

---

## Toast Message Guidelines

### Message Format Standards

#### Success Messages
- **Pattern:** `[Action] [noun] [adverb]`
- **Examples:**
  - "Role assigned successfully"
  - "Message sent to 15 users"
  - "Template updated successfully"
- **Length:** Keep under 60 characters
- **Tone:** Positive, confirmatory

#### Error Messages
- **Pattern:** `Failed to [action]. [helpful context]`
- **Examples:**
  - "Failed to assign role. Please try again."
  - "Failed to send message. Check your network connection."
  - "Failed to delete role. Role is still in use."
- **Length:** Keep under 80 characters
- **Tone:** Helpful, not blaming

#### Warning Messages
- **Pattern:** `[Condition or action]. [consequence or next step]`
- **Examples:**
  - "Password strength is weak. Consider adding numbers and symbols."
  - "Session expiring soon. Please save your work."
- **Tone:** Informative, actionable

#### Info Messages
- **Pattern:** `[Information or status]`
- **Examples:**
  - "Loading data from server..."
  - "No results found for your search"
- **Tone:** Neutral, factual

### Contextual Information

**Include when relevant:**
- User names: "Role assigned to John Smith"
- Counts: "Message sent to 15 users"
- Entity names: "Template 'Bushfire Alert' updated"
- Action results: "3 of 5 coordinators updated"

**Avoid:**
- Technical jargon: "Failed to INSERT INTO users_roles"
- Raw error codes: "Error 500"
- Blame: "You didn't fill out the form correctly"

---

## Server-Side Implementation Guide

### Standard Response Format

All form actions should return consistent response objects:

```typescript
// Success
{
  success: true,
  message: string,
  data?: any
}

// Error
{
  success: false,
  message: string,
  errors?: { [field: string]: string }
}
```

### Example Server Action

**Before:**
```typescript
export const actions: Actions = {
  assignRole: async ({ request, locals: { supabase } }) => {
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id, role_id });

    if (error) throw error(400, error.message);

    return { success: true };
  }
};
```

**After:**
```typescript
export const actions: Actions = {
  assignRole: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const userId = formData.get('user_id');
    const roleId = formData.get('role_id');

    // Get names for better toast message
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

    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role_id: roleId });

    if (error) {
      return fail(400, {
        success: false,
        message: `Failed to assign role: ${error.message}`
      });
    }

    return {
      success: true,
      message: `Role '${role.name}' assigned to ${user.full_name} successfully`
    };
  }
};
```

---

## Design System Integration

### Skeleton Labs Theme Mapping

Your app uses `@skeletonlabs/skeleton` v3.1.3. Map toast types to Skeleton's color system:

```typescript
const skeletonStyles = {
  success: 'variant-filled-success',
  error: 'variant-filled-error',
  warning: 'variant-filled-warning',
  info: 'variant-filled-secondary'
};
```

**Alternative:** Use custom Tailwind classes for more control (recommended).

### Tailwind Configuration

Add toast-specific utilities if needed:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'slide-in': 'slideIn 0.2s ease-out',
        'slide-out': 'slideOut 0.2s ease-in'
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 }
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: 1 },
          '100%': { transform: 'translateX(100%)', opacity: 0 }
        }
      }
    }
  }
};
```

---

## Testing Strategy

### Unit Tests

**Test File:** `src/stores/toaststore.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { toast } from './toaststore';
import { get } from 'svelte/store';

describe('Toast Store', () => {
  it('should add success toast', () => {
    toast.success('Test message');
    const state = get(toast);
    expect(state.toasts).toHaveLength(1);
    expect(state.toasts[0].type).toBe('success');
  });

  it('should auto-dismiss after duration', async () => {
    toast.success('Test', 100);
    await new Promise(resolve => setTimeout(resolve, 150));
    const state = get(toast);
    expect(state.toasts).toHaveLength(0);
  });

  it('should dismiss manually', () => {
    const id = toast.success('Test');
    toast.dismiss(id);
    const state = get(toast);
    expect(state.toasts).toHaveLength(0);
  });
});
```

### Integration Tests

**Test Scenarios:**
1. Form submission → success toast appears
2. Form submission with error → error toast appears
3. Multiple rapid submissions → toasts stack properly
4. Toast auto-dismisses after 5 seconds
5. Manual dismiss button works
6. Escape key dismisses toast

### Manual Testing Checklist

For each implemented button:
- [ ] Success toast appears with correct message
- [ ] Error toast appears on failure
- [ ] Toast is readable and properly styled
- [ ] Toast auto-dismisses after 5 seconds
- [ ] Can manually dismiss toast
- [ ] Multiple toasts stack properly
- [ ] Screen reader announces toast
- [ ] Keyboard accessible (Escape to dismiss)
- [ ] Mobile responsive
- [ ] Works in all major browsers

---

## Migration Strategy

### Gradual Rollout

**Phase-by-Phase Deployment:**
1. Deploy toast infrastructure (Phase 0)
2. Update critical auth flows first
3. Gather user feedback
4. Iterate on messaging and timing
5. Roll out to remaining features

### Coexistence with Existing Feedback

During migration, toasts will **coexist** with:
- Inline error messages (keep for form validation)
- Confirmation dialogs (keep for destructive actions)
- Loading spinners (keep for in-progress state)

**Post-Migration:**
- Remove panel-specific success/error message state
- Standardize all action feedback through toasts
- Keep validation messages inline (field-level errors)

---

## Performance Considerations

### Optimization Strategies

1. **Limit Active Toasts:** Maximum 5 simultaneous toasts
   ```typescript
   function addToast(type, message, duration) {
     update((state) => {
       const toasts = [...state.toasts, newToast];
       // Keep only latest 5
       return { toasts: toasts.slice(-5) };
     });
   }
   ```

2. **Debounce Rapid Toasts:** Prevent duplicate messages
   ```typescript
   let lastMessage = '';
   let lastTime = 0;

   function addToast(type, message, duration) {
     const now = Date.now();
     if (message === lastMessage && now - lastTime < 1000) {
       return; // Ignore duplicate within 1 second
     }
     // ... add toast
   }
   ```

3. **Lazy Load Icons:** Use dynamic imports for lucide-svelte icons if bundle size is a concern

---

## Documentation & Training

### Developer Documentation

**Create:** `docs/TOAST-USAGE.md`

Include:
- Quick start guide
- API reference
- Common patterns
- Examples for each toast type
- Troubleshooting

### Code Comments

Add JSDoc comments to toast store:

```typescript
/**
 * Display a success notification toast
 * @param message - The message to display
 * @param duration - Auto-dismiss time in milliseconds (default: 5000)
 * @returns Toast ID for manual dismissal
 */
success: (message: string, duration?: number) => string
```

---

## Rollback Plan

If issues arise:

1. **Quick Rollback:** Remove `<Toasts />` from layout
2. **Partial Rollback:** Disable toasts for specific features
3. **Revert to Inline Messages:** Keep old message components as fallback

**Monitoring:**
- Watch for errors in browser console
- Check analytics for user friction points
- Gather feedback through support channels

---

## Success Metrics

### Key Performance Indicators

1. **User Feedback Clarity**
   - Reduction in "did my action work?" support tickets
   - User testing feedback scores

2. **Error Recovery**
   - Time to identify and fix action failures
   - User retry success rate after errors

3. **Technical Quality**
   - Zero console errors related to toasts
   - Accessibility audit pass rate
   - Performance impact (< 50ms render time)

---

## Summary & Next Steps

### Implementation Checklist

- [ ] **Phase 0:** Create toast store and component (4 hours)
- [ ] **Phase 1:** Auth & user management (6 hours)
- [ ] **Phase 2:** Admin operations (8 hours)
- [ ] **Phase 3:** Tables & modals (6 hours)
- [ ] **Phase 4:** Map & events (4 hours)
- [ ] **Phase 5:** Polish & testing (6 hours)

**Total Estimated Time:** 34 hours (~5 working days)

### Priority Order

1. ✅ Phase 0 - Foundation
2. 🔴 Critical auth flows (highest risk)
3. 🟡 Admin operations (medium impact)
4. 🟢 Lower priority features
5. ✨ Polish and accessibility

### Questions for Team

Before starting implementation:

1. **Design approval:** Confirm toast positioning (top-right vs top-center)
2. **Duration:** 5 seconds auto-dismiss acceptable? Configurable per message?
3. **Sound:** Should toasts have audio notifications (accessibility)?
4. **Persistence:** Should errors persist until manually dismissed?
5. **Queue limit:** Is 5 simultaneous toasts appropriate?

---

**Plan Status:** ✅ Ready for Implementation
**Next Action:** Review and approve plan, then begin Phase 0
**Owner:** Development Team
**Reviewer:** Tech Lead / UX Designer
