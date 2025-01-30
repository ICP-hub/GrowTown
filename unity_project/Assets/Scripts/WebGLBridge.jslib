mergeInto(LibraryManager.library, {
    SendMessageToJS: function(eventNamePtr) {
        var eventName = UTF8ToString(eventNamePtr);
        console.log("📢 Unity called JavaScript event:", eventName);
        window.dispatchEvent(new Event(eventName));
    },

      UnityLogin: function() {
        console.log("🔄 Unity WebGL requested login...");
        window.dispatchEvent(new Event("UnityLoginRequest"));
    }
});