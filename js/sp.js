$(document).ready(function () {
  var module = ExternalModules['SP'].ExternalModule;
  // module.log('hello from js');
  console.log(module);
  console.log(module.tt('ajaxPage'));

  const App = {
    data() {
      return {
        counter: 0
      }
    },
    methods: {
      increment: function () {
        this.counter++;
      },
      testRedCapCall: function () {
        var value = unescape(module.tt('ajaxPage'));
        $.get({
          url: value.replace('"',""),
          data: {
            function: 'sampleFunction',
            data: 'Hello from JS'
          },
        })
          .done(function (data) {
            if (data.errors) {
              // TODO: parse and report errors
              return 0;
            }
            console.log(data);
            // location.reload();

            // // TODO: consider re-enabling this if targeting an event and the migration was successfull
            // //if (deleteSourceData /* && entireEvent */) {
            // //    doDeleteEventInstance(sourceEventId); // reloads page on completion
            // //} else {
            // //    location.reload();
            // //}
          });
      }
    }
  }

  Vue.createApp(App).mount('#app');
});