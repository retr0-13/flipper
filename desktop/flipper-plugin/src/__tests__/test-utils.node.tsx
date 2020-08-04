/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as TestUtils from '../test-utils/test-utils';
import * as testPlugin from './TestPlugin';
import {createState} from '../state/atom';
import {PluginClient} from '../plugin/Plugin';
import {DevicePluginClient} from '../plugin/DevicePlugin';

test('it can start a plugin and lifecycle events', () => {
  const {instance, ...p} = TestUtils.startPlugin(testPlugin);

  // @ts-expect-error
  p.bla;
  // @ts-expect-error
  instance.bla;

  // startPlugin starts connected
  expect(instance.connectStub).toBeCalledTimes(1);
  expect(instance.disconnectStub).toBeCalledTimes(0);
  expect(instance.activateStub).toBeCalledTimes(1);
  expect(instance.deactivateStub).toBeCalledTimes(0);
  expect(instance.destroyStub).toBeCalledTimes(0);

  p.connect(); // noop
  expect(instance.connectStub).toBeCalledTimes(1);
  expect(instance.disconnectStub).toBeCalledTimes(0);
  expect(instance.activateStub).toBeCalledTimes(1);
  expect(instance.deactivateStub).toBeCalledTimes(0);
  expect(instance.destroyStub).toBeCalledTimes(0);

  p.disconnect();
  p.connect();

  expect(instance.connectStub).toBeCalledTimes(2);
  expect(instance.disconnectStub).toBeCalledTimes(1);
  expect(instance.destroyStub).toBeCalledTimes(0);

  p.deactivate(); // also disconnects
  p.activate();
  expect(instance.connectStub).toBeCalledTimes(3);
  expect(instance.disconnectStub).toBeCalledTimes(2);
  expect(instance.activateStub).toBeCalledTimes(2);
  expect(instance.deactivateStub).toBeCalledTimes(1);

  p.destroy();
  expect(instance.connectStub).toBeCalledTimes(3);
  expect(instance.disconnectStub).toBeCalledTimes(3);
  expect(instance.activateStub).toBeCalledTimes(2);
  expect(instance.deactivateStub).toBeCalledTimes(2);
  expect(instance.destroyStub).toBeCalledTimes(1);

  // cannot interact with destroyed plugin
  expect(() => {
    p.connect();
  }).toThrowErrorMatchingInlineSnapshot(`"Plugin has been destroyed already"`);
  expect(() => {
    p.activate();
  }).toThrowErrorMatchingInlineSnapshot(`"Plugin has been destroyed already"`);
});

test('it can start a plugin and lifecycle events for background plugins', () => {
  const {instance, ...p} = TestUtils.startPlugin(testPlugin, {
    isBackgroundPlugin: true,
  });

  // @ts-expect-error
  p.bla;
  // @ts-expect-error
  instance.bla;

  // startPlugin starts connected
  expect(instance.connectStub).toBeCalledTimes(1);
  expect(instance.disconnectStub).toBeCalledTimes(0);
  expect(instance.activateStub).toBeCalledTimes(1);
  expect(instance.deactivateStub).toBeCalledTimes(0);
  expect(instance.destroyStub).toBeCalledTimes(0);

  p.deactivate(); // bg, no disconnection
  p.activate();
  expect(instance.connectStub).toBeCalledTimes(1);
  expect(instance.disconnectStub).toBeCalledTimes(0);
  expect(instance.activateStub).toBeCalledTimes(2);
  expect(instance.deactivateStub).toBeCalledTimes(1);

  p.destroy();
  expect(instance.connectStub).toBeCalledTimes(1);
  expect(instance.disconnectStub).toBeCalledTimes(1);
  expect(instance.activateStub).toBeCalledTimes(2);
  expect(instance.deactivateStub).toBeCalledTimes(2);
  expect(instance.destroyStub).toBeCalledTimes(1);
});

test('it can render a plugin', () => {
  const {renderer, sendEvent, instance} = TestUtils.renderPlugin(testPlugin);

  expect(renderer.baseElement).toMatchInlineSnapshot(`
    <body>
      <div>
        <h1>
          Hi from test plugin 
          0
        </h1>
      </div>
    </body>
  `);

  sendEvent('inc', {delta: 3});

  expect(renderer.baseElement).toMatchInlineSnapshot(`
    <body>
      <div>
        <h1>
          Hi from test plugin 
          3
        </h1>
      </div>
    </body>
  `);

  // @ts-ignore
  expect(instance.state.listeners.length).toBe(1);
  renderer.unmount();
  // @ts-ignore
  expect(instance.state.listeners.length).toBe(0);
});

test('a plugin can send messages', async () => {
  const {instance, onSend} = TestUtils.startPlugin(testPlugin);

  // By default send is stubbed
  expect(await instance.getCurrentState()).toBeUndefined();
  expect(onSend).toHaveBeenCalledWith('currentState', {since: 0});

  // @ts-expect-error
  onSend('bla');

  // ... But we can intercept!
  onSend.mockImplementationOnce(async (method, params) => {
    expect(method).toEqual('currentState');
    expect(params).toEqual({since: 0});
    return 3;
  });
  expect(await instance.getCurrentState()).toEqual(3);
});

test('a plugin cannot send messages after being disconnected', async () => {
  const {instance, disconnect} = TestUtils.startPlugin(testPlugin);

  disconnect();
  let threw = false;
  try {
    await instance.getCurrentState();
  } catch (e) {
    threw = true; // for some weird reason expect(async () => instance.getCurrentState()).toThrow(...) doesn't work today...
    expect(e).toMatchInlineSnapshot(`[Error: Plugin is not connected]`);
  }
  expect(threw).toBeTruthy();
});

test('a plugin can receive messages', async () => {
  const {instance, sendEvent, exportState} = TestUtils.startPlugin(testPlugin);
  expect(instance.state.get().count).toBe(0);

  sendEvent('inc', {delta: 2});
  expect(instance.state.get().count).toBe(2);
  expect(exportState()).toMatchInlineSnapshot(`
    Object {
      "counter": Object {
        "count": 2,
      },
    }
  `);
});

test('plugins support non-serializable state', async () => {
  const {exportState} = TestUtils.startPlugin({
    plugin() {
      const field1 = createState(true);
      const field2 = createState(
        {
          test: 3,
        },
        {
          persist: 'field2',
        },
      );
      return {
        field1,
        field2,
      };
    },
    Component() {
      return null;
    },
  });
  // states are serialized in creation order
  expect(exportState()).toEqual({field2: {test: 3}});
});

test('plugins support restoring state', async () => {
  const {exportState} = TestUtils.startPlugin(
    {
      plugin() {
        const field1 = createState(1, {persist: 'field1'});
        const field2 = createState(2);
        const field3 = createState(3, {persist: 'field3'});
        expect(field1.get()).toBe('a');
        expect(field2.get()).toBe(2);
        expect(field3.get()).toBe('b');
        return {};
      },
      Component() {
        return null;
      },
    },
    {
      initialState: {field1: 'a', field3: 'b'},
    },
  );
  expect(exportState()).toEqual({field1: 'a', field3: 'b'});
});

test('plugins cannot use a persist key twice', async () => {
  expect(() => {
    TestUtils.startPlugin({
      plugin() {
        const field1 = createState(1, {persist: 'test'});
        const field2 = createState(2, {persist: 'test'});
        return {field1, field2};
      },
      Component() {
        return null;
      },
    });
  }).toThrowErrorMatchingInlineSnapshot(
    `"Some other state is already persisting with key \\"test\\""`,
  );
});

test('plugins can receive deeplinks', async () => {
  const plugin = TestUtils.startPlugin({
    plugin(client: PluginClient) {
      client.onDeepLink((deepLink) => {
        if (typeof deepLink === 'string') {
          field1.set(deepLink);
        }
      });
      const field1 = createState('', {persist: 'test'});
      return {field1};
    },
    Component() {
      return null;
    },
  });

  expect(plugin.instance.field1.get()).toBe('');
  plugin.triggerDeepLink('test');
  expect(plugin.instance.field1.get()).toBe('test');
});

test('device plugins can receive deeplinks', async () => {
  const plugin = TestUtils.startDevicePlugin({
    devicePlugin(client: DevicePluginClient) {
      client.onDeepLink((deepLink) => {
        if (typeof deepLink === 'string') {
          field1.set(deepLink);
        }
      });
      const field1 = createState('', {persist: 'test'});
      return {field1};
    },
    supportsDevice: () => true,
    Component() {
      return null;
    },
  });

  expect(plugin.instance.field1.get()).toBe('');
  plugin.triggerDeepLink('test');
  expect(plugin.instance.field1.get()).toBe('test');
});

test('plugins can register menu entries', async () => {
  const plugin = TestUtils.startPlugin({
    plugin(client: PluginClient) {
      const counter = createState(0);
      client.addMenuEntry(
        {
          action: 'createPaste',
          handler() {
            counter.set(counter.get() + 1);
          },
        },
        {
          label: 'Custom Action',
          topLevelMenu: 'Edit',
          handler() {
            counter.set(counter.get() + 3);
          },
        },
      );
      return {counter};
    },
    Component() {
      return null;
    },
  });

  expect(plugin.instance.counter.get()).toBe(0);
  plugin.triggerDeepLink('test');
  plugin.triggerMenuEntry('createPaste');
  plugin.triggerMenuEntry('Custom Action');
  expect(plugin.instance.counter.get()).toBe(4);
  expect(plugin.flipperLib.enableMenuEntries).toBeCalledTimes(1);

  plugin.deactivate();

  expect(() => {
    plugin.triggerMenuEntry('Non Existing');
  }).toThrowErrorMatchingInlineSnapshot(
    `"No menu entry found with action: Non Existing"`,
  );
});

test('plugins can create pastes', async () => {
  const plugin = TestUtils.startPlugin({
    plugin(client: PluginClient) {
      return {
        doIt() {
          client.createPaste('test');
        },
      };
    },
    Component() {
      return null;
    },
  });

  plugin.instance.doIt();
  expect(plugin.flipperLib.createPaste).toBeCalledWith('test');
});
