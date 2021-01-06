$(document).ready(function () {

  console.log('hello workd');
  const app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data () { 
      return {
        currentParams: {
          data: '',
          function: '',
          pid: ''
        },
        module: ExternalModules['SP'].ExternalModule,
        filterParams: {

        },
        responseData: []
      }
    },
    created: function() {
      this.currentParams.pid = this.pid;
    },
    computed: {
      pid: function() {
        return this.urlParam('pid');
      },
      url: function() {
        var url = unescape(this.module.tt('ajaxPage').replaceAll('"', ""));
        console.log(url);
        return url;
      }
    },
    methods: {
      request: function (params, targetData, openDialog = false) {
        var self = this;
        self.initiatedRequest = true;
        $.get({
          url: self.url,
          data: {...params}//{ ...self.currentParams }
        }).done(function (response) {
          // console.log(response, response.data);
          response = self.parseJSON(response);
          if (response.error) {
            alert(response.error);
            return;
          }
          self.initiatedRequest = false;
          self[targetData] = response.data;
          if (openDialog) {
            self.dialog = true;
          }
          // console.log(self[targetData]);
          // console.log(typeof self.responseData, self.responseData);
        });
      },
      parseJSON: function(json) {
        try {
          return JSON.parse(json);
        } catch (err) {
          console.log("Error occurred for: " + json);
          console.log("With error: " + err);
          this.initiatedRequest = false;
        }
      },
      sendEmail: function(emailData) {
        this.request({
          function: 'sendEmail'
        }, 'responseData');
      },
      urlParam: function (key) {
        const queryString = window.location.search;
        return new URLSearchParams(queryString).get(key);
      }
    },
  });
});