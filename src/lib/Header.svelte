<script>
  import { user, username } from "./user.js";
  function signout() {
    user.leave();
    username.set("");
  }
</script>

<header>
  <h1>🔫💬</h1>
  {#if $username}
    <span> Hello, <string> {$username}</string> </span>
    <img
      src={`https://avatars.dicebear.com/api/initials/${$username}.svg`}
      alt="avatar"
    />
    <button class="signout" on:click={signout}> Sign out </button>
  {:else}
    <h3>Gun.js Chat app</h3>
  {/if}
</header>
