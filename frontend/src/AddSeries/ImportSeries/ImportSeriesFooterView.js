var _ = require('underscore');
var Marionette = require('marionette');
var profileCollection = require('Profile/profileCollection');
var tpl = require('./ImportSeriesFooterView.hbs');

const ImportSeriesFooterView = Marionette.ItemView.extend({
  template: tpl,

  ui: {
    monitored: '.x-monitored',
    profile: '.x-profiles',
    seasonFolder: '.x-season-folder',
    selectedCount: '.x-selected-count',
    actions: '.x-action'
  },

  events: {
    'click .x-import': 'onImportSeries'
  },

  templateHelpers() {
    return {
      profiles: profileCollection
    };
  },

  initialize(options) {
    this.collection = options.collection;
    this.listenTo(this.collection, 'selected', this._updateInfo);
  },

  _updateInfo() {
    var selected = this.collection.getSelected();
    var selectedCount = selected.length;

    this.ui.selectedCount.text(selected.length);

    if (selectedCount === 0) {
      this.ui.actions.attr('disabled', 'disabled');
    } else {
      this.ui.actions.removeAttr('disabled');
    }
  },

  onRender() {
    this._updateInfo();
  },

  onImportSeries() {
    const selected = this.collection.getSelected();
    const monitored = this.ui.monitored.val();
    const profile = this.ui.profile.val();
    var seasonFolder = this.ui.seasonFolder.val();

    _.each(selected, (model) => {
      if (monitored === 'true') {
        model.set('monitored', true);
      } else if (monitored === 'false') {
        model.set('monitored', false);
      }

      if (profile !== 'noChange') {
        model.set('profileId', parseInt(profile, 10));
      }

      if (seasonFolder === 'true') {
        model.set('seasonFolder', true);
      } else if (seasonFolder === 'false') {
        model.set('seasonFolder', false);
      }

      model.edited = true;
    });

    this.seriesCollection.save();
  }
});

module.exports = ImportSeriesFooterView;