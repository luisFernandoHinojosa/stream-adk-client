<script lang="ts">
	import { formatTime } from '$lib/utils/formatTime';

	import { getFormattedLocalDateTime } from '$lib/utils/getFormattedLocalDateTime';

	let { children, user, photoURL = '', className = '', time = null } = $props();
</script>

<div class="flex items-center {className}">
	{#if user === 'user'}
		<span class="mr-2 h-9 min-h-9 w-9 min-w-9"> B </span>
	{:else}
		<span class="ml-2 h-9 min-h-9 w-9 min-w-9"> L </span>
	{/if}
	<div
		class="grid flex-col flex-nowrap rounded-2xl p-4 break-all shadow-md transition-colors
                {user === 'user'
			? 'bg-light-two_d dark:bg-dark-two_d max-w-[80%]  rounded-br-none'
			: 'bg-light-one_d dark:bg-dark-one_d rounded-bl-none '} 
                "
	>
		<p
			class="text-sm sm:text-base {user === 'user'
				? ' text-light-one dark:text-dark-one'
				: ' text-light-two dark:text-dark-two'} "
		>
			{@render children()}
		</p>
		<p
			class="mt-1 text-xs opacity-70 {user === 'user'
				? '  text-light-one dark:text-dark-one  '
				: ' text-light-two dark:text-dark-two'}"
		>
			{formatTime(time ? time : getFormattedLocalDateTime())}
		</p>
	</div>
</div>
