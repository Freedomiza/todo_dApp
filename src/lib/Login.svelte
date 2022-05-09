<script>
  import { user } from "./user.js";
  let username, password;
  function login() {
    user.auth(username, password, ({ err }) => {
      err && alert(err);
    });
  }
  function signup() {
    user.create(username, password, ({ err }) => {
      err ? alert(err) : login();
    });
  }
</script>

<label for="username">Username </label>
<input name="username" bind:value={username} minlength="3" maxlength="100" />
<br />
<label for="password">Password </label>
<input
  name="password"
  bind:value={password}
  type="password"
  required
  minlength="6"
/>

<button class="login" on:click={login}>Login</button>
<button class="login" on:click={signup}>Sign Up</button>
