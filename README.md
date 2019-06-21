###### Admercury
# Event Manager

Namespace and action based multi level events management for node and web applications.

This module can be used to pass variables from system to system in a stateless environment. A part can listen to and event, and another can raise the same event. Methods can be set as chained promise calls or async.



### Global access

To make sure that there is a single instance for the event manager, you can keep a reference to the created object in node's **globals**, or in dom's **window** modules depending on the platform you are building for.

To define the code completion and a string Typescript reference, create a new typescript file in your project. If you are developing for node environment, you can extend the global object for event manager like this:

```typescript
import EventManager from 'library-event-manager';

declare global {
  namespace NodeJS {
    interface Global {
      eventManager: EventManager;
    }
  }
}
  
global.eventManager = new EventManager();
```

If you are developing for web browsers, you can extend the window object for event manager like this

```typescript
import EventManager from 'library-event-manager';

declare global {
  interface Window {
    eventManager: EventManager;
  }
}

window.eventManager = new EventManager();
```



### Registering for events

In this example, we are defining an interface for a passing an object called IDemoObject to demonstrate the possibility to wait for complex objects.

```typescript
interface IDemoObject {
  name: string;
  surname: string;
}

const toBeCalled = ( left: number, right: number, person: IDemoObject ) => {
  const c = left + right;
  console.log( c );

  console.log( person.name );
  console.log( person.surname );
};
```

The correct way of defining namespace and action names is writing exported enums to make sure you are not making any spelling errors. To assign the function as a listening endpoint the namespace/action layer, use **addEventListener** method.

```typescript
export enum ENamespace {
  admercury = 'com.admercury',
}

export enum EAction {
  dump = 'dump',
}

global.eventManager.addEventListener( ENamespace.admercury, EAction.dump, toBeCalled );
```



### Calling events

On any point, to call an **event**, use the event method of event manager. After defining the namespace and action layer, you can pass multiple arguments to the event that will be piped directly to the listening methods.

```typescript
const person = {
  name   : 'John',
  surname: 'Doe',
} as IDemoObject;

global.eventManager.event( ENamespace.admercury, EAction.dump, 1, 2, person );
```



### Unregistering from events

To unregister from an event, you can either use **removeEventListener** that requires namespace and action layer to be defined or **removeListener** for all layers. First method removes the listener from the specified layer. Second method removes it from all possible layers that the method is listening for.

```typescript
// Remove from a single namespace action layer
global.eventManager.removeEventListener( ENamespace.admercury, EAction.dump, toBeCalled );
```

```typescript
// Remove from all possible layers
global.eventManager.removeListener( toBeCalled );
```



### Single time calls

You can define a special listener that will only be called once by the defined event. This can be achieved by simply telling the addEventListener method that this method is a single time listener. These listeners will be removed from the internal reference list of event manager right after the call is made.

```typescript
global.eventManager.addEventListener( ENamespace.admercury, EAction.dump, toBeCalled, true );
```



## Notes

If you are specifying your target something newer than es6, Typescript will change your moduleResolution to "Classic" mode. This might cause an "extension not found" error in your code. Please make sure that your `tsconfig.json` file specifies module resolutions as Node.

```json
{
  "compilerOptions": {
    "moduleResolution": "Node"
  }
}
```



