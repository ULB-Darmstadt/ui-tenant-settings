jest.mock('stripes-config', () => (
  {
    modules: {
      plugin: [
        {
          description: 'Instance-finder for Stripes',
          displayName: 'ui-plugin-find-instance.meta.title',
          getModule: () => {},
          module: '@folio/plugin-find-instance',
          pluginType: 'find-instance',
          version: '1.0.0',
        }
      ],
    },
    metadata: {},
    icons: {},
  }
), { virtual: true });
