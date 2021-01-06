$(document).ready(function () {
  const fEvents = 'getEvents';
  const fModules = 'getExternalModules';
  const fProjects = 'getProjects';
  const fTemplates = 'getTemplates';  

  const app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data () { 
      return {
        currentParams: {
          data: '',
          function: fModules,
          pid: '',
        },
        dialog: false,
        filterMapping: {},
        filterParams: {
          event: '',
          external_module_id: '',
          project_id: '',
          user: '',
        },
        initiatedRequest: false,
        itemsPerPage: 10,
        handlerFunctions: [
          { 'value': fEvents, 'text': 'events' },
          { 'value': fModules, 'text': 'modules' },
          { 'value': fProjects, 'text': 'projects' },
          { 'value': fTemplates, 'text': 'templates' },
        ],
        headerMappinp: {},
        module: ExternalModules['SP'].ExternalModule,
        page: 1,
        pageCount: 0,
        dialogResponseData: [],
        responseData: [],
        search: '',
        tab: null,
      }
    },
    created: function() {
      // Initialize headerMapping
      this.headerMapping = {};
      this.headerMapping[fEvents] = [
        { value: 'log_event_id', text: 'Log ID' },
        { 
          value: 'project_id', 
          text: 'Project ID' ,
          filter: value => {
            if (!this.filterParams.project_id) return true;
            var result = value === this.filterParams.project_id; 
            return result;
          },
          filterLabel: '='
        },
        { 
          value: 'user', 
          text: 'User',
          filter: value => {
            if (!this.filterParams.user) return true;
            var result = contains(value.toLowerCase(), this.filterParams.user.toLowerCase());
            return result;
          },
          filterLabel: '='
        },
        { value: 'page', text: 'Page' },
        { 
          value: 'event', 
          text: 'Event',
          filter: value => {
            if (!this.filterParams.event) return true;
            var result = contains(value.toLowerCase(), this.filterParams.event.toLowerCase());
            return result;
          },
          filterLabel: '='
        },
        { value: 'description', text: 'Description' }
      ];
      this.headerMapping[fModules] = [
        { 
          value: 'external_module_id', 
          text: 'External Module ID',
          filter: value => {
            if (!this.filterParams.external_module_id) return true;
            var result = value === this.filterParams.external_module_id; 
            return result;
          },
          filterLabel: '='
        },
        { value: 'directory_prefix', text: 'Directory Prefix' }
      ];
      this.headerMapping[fProjects] = [
        { 
          value: 'project_id', 
          text: 'Project ID',
          filter: value => {
            if (!this.filterParams.project_id) return true;
            var result = value === this.filterParams.project_id; 
            return result;
          },
          filterLabel: '='
        },
        // { value: 'project_name', text: 'Project Name' },
        { value: 'app_title', text: 'Project Title' },
        { value: 'status', text: 'Status' },
        { value: 'creation_time', text: 'Created On' },
        { value: 'production_time', text: 'Moved to Prod On' },
        { value: 'url', text: 'Project Page' },
      ];
      this.headerMapping[fTemplates] = [
        { 
          value: 'project_id', 
          text: 'Project ID',
          filter: value => {
            if (!this.filterParams.project_id) return true;
            var result = value === this.filterParams.project_id; 
            return result;
          },
          filterLabel: '='
        },
        { value: 'title', text: 'Title' },
        { value: 'description', text: 'Description' },
      ];

      console.log(this.headerMapping);

      // Initialize filterMapping
      this.filterMapping = {};
      this.filterMapping[fEvents] = [
        { value: 'project_id', text: 'Project'},
        { value: 'user', text: 'User'},
        { value: 'event', text: 'Event'},
      ];
    },
    computed: {
      contains: function(source, target, options) {
        // TODO : add options for case sensitivity
        // var result = sourceStr.toLowerCase().indexOf(targetStr.toLowerCase()) >= 0;
        console.log(source, target);
        var result = source.indexOf(target) >= 0;
        return result; 
      },
      // TODO: Change the dependency on currentParams.function for determining which filter to display
      getFilters: function() {
        var temp = this.filterMapping[this.currentParams.function];
        return temp;
      },
      // TODO: Change the dependency on currentParams.function for determining which header to display
      getHeaders: function() {
        var temp = this.headerMapping[this.currentParams.function];
        return temp;
      },
      getTabs: function() {
        var titles = [];
        for (var i = 0; i < this.handlerFunctions.length; i++) {
          titles.push(this.handlerFunctions[i].text);
        }
        return titles;
      },
      isLoading: function() {
        return this.initiatedRequest;
      },
      // TODO: Update to local variable, this is no longer in the URL the plugin lives outside the project context
      // pid: function() {
      //   return this.urlParam('pid');
      // },
      url: function() {
        var url = unescape(this.module.tt('ajaxPage').replaceAll('"', ""));
        console.log(url);
        return url;
      }
    },
    methods: {
      getTabIndex: function(text) {
        for (var i = 0; i < this.handlerFunctions.length; i++) {
          if (this.handlerFunctions[i].text === text) {
            return i;
          }
        }
      },
      focusProjectTab: function(pid) {
        var tabIndex = this.getTabIndex('projects');
        this.filterParams.project_id = pid;
        this.focusTab(tabIndex);
      },
      focusTab: function (tabIndex) {
        this.tab = tabIndex;
        this.currentParams.function = this.handlerFunctions[tabIndex].value;
        this.responseData = [];
        this.getData({
          data: this.currentParams.data,
          function: this.currentParams.function,
          pid: null
        }, "responseData");
      },
      getData: function (params, targetData, openDialog = false) {
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
      parseJSON(json) {
        try {
          return JSON.parse(json);
        } catch (err) {
          console.log("Error occurred for: " + json);
          console.log("With error: " + err);
          this.initiatedRequest = false;
        }
      },
      showProjectInfo: function(pid) {
        this.currentParams.pid = pid;
        this.dialogResponseData = [];
        this.getData({
          data: this.currentParams.data,
          function: 'getAllData',
          pid: pid 
        }, "dialogResponseData", true);
      },
      urlParam: function (key) {
        const queryString = window.location.search;
        return new URLSearchParams(queryString).get(key);
      }
    },
  });
});