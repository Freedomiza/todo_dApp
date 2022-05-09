<script>
  import GUN from "gun";
  import SEA from "gun/sea";
  import { onMount } from "svelte";
  import { debounce } from "lodash-es";
  import { user, username } from "./user";
  import Login from "./Login.svelte";
  import ChatMessage from "./ChatMessage.svelte";

  const db = GUN();
  let newMessage = "";
  let canAutoScroll = true;
  let lastScrollTop;
  let scrollBottom;
  let messages = [];
  let unreadMessages = false;
  $: debouncedWatchScroll = debounce(watchScroll, 1000);

  function watchScroll(e) {
    canAutoScroll = (e.target.scrollTop || Infinity) > lastScrollTop;
    lastScrollTop = e.target.scrollTop;
  }

  function autoScroll() {
    setTimeout(() => scrollBottom?.scrollIntoView({ behavior: "auto" }), 50);
    unreadMessages = false;
  }

  var match = {
    // lexical queries are kind of like a limited RegEx or Glob.
    ".": {
      // property selector
      ">": new Date(+new Date() - 1 * 1000 * 60 * 60 * 3).toISOString(), // find any indexed property larger ~3 hours ago
    },
    "-": 1, // filter in reverse
  };
  const dKey = "randomstringabcxyz123456789";

  onMount(() => {
    db.get("chat")
      .map(match)
      .on(async (data, id) => {
        if (data) {
          // TODO: add get decrypt key api
          const key = dKey;
          const message = {
            who: await db.user(data).get("alias"),
            what: (await SEA.decrypt(data.what, key)) + "",
            when: GUN.state.is(data, "what"), // get the internal timestamp for the what property.
          };

          if (message.what && message.what !== "undefined") {
            if (messages.findIndex((r) => r.when === message.when) === -1) {
              messages = [...messages.slice(-100), message].sort(
                (a, b) => a.when - b.when
              );
            }

            if (canAutoScroll) {
              setTimeout(
                () => scrollBottom?.scrollIntoView({ behavior: "auto" }),
                50
              );
              unreadMessages = false;
            }
          }
        }
      });
  });

  async function sendMessage() {
    console.log("sendMessage");
    const secret = await SEA.encrypt(newMessage, dKey);
    const message = user.get("all").set({ what: secret });
    const index = new Date().toISOString();
    db.get("chat").get(index).put(message);
    newMessage = "";
    canAutoScroll = true;
    autoScroll();
  }
</script>

<div class="container">
  {#if $username}
    <main on:scroll={debouncedWatchScroll}>
      {#each messages as message (message.when)}
        <ChatMessage {message} sender={$username} />
      {/each}
      <div class="dummy" bind:this={scrollBottom} />
    </main>
    <form on:submit|preventDefault={sendMessage}>
      <input
        type="text"
        placeholder="Type a message..."
        bind:value={newMessage}
        maxlength="100"
      />
      <button type="submit" disabled={!newMessage}>💥</button>
    </form>
    {#if !canAutoScroll}
      <div class="scroll-button">
        <button on:click={autoScroll} class:red={unreadMessages}>
          {#if unreadMessages}
            💬
          {/if}
          👇
        </button>
      </div>
    {/if}
  {:else}
    <main>
      <Login />
    </main>
  {/if}
</div>
