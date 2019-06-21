/**
 * Event Manager
 * Namespace and action based multi level events management for node and web applications.
 *
 * This module can be used to pass variables from system to system in a stateless environment.
 * A part can listen to and event, and another can raise the same event.
 * Methods can be set as chained promise calls or async.
 */
export class EventManager {
  /**
   * Internal method, do not use directly.
   * @param namespace {string}
   * @param action {string}
   * @param delegateHolder {object}
   */
  private static createEvent ( namespace: string, action: string, delegateHolder: object ): void {
    const defineIn: any = delegateHolder;

    if ( !defineIn.hasOwnProperty( namespace ) ) {
      defineIn[ namespace ]           = {};
      defineIn[ namespace ][ action ] = [];
    } else if ( !defineIn[ namespace ].hasOwnProperty( action ) ) {
      defineIn[ namespace ][ action ] = [];
    }
  }

  /**
   * Internal method, do not use directly.
   * @param array
   * @param delegateFunction
   */
  private static remove ( array: [], delegateFunction: any ): void {
    for (let i = 0; i < array.length; i += 1) {
      if ( array[ i ] === delegateFunction ) {
        array.splice( i, 1 );
        return;
      }
    }
  }

  /**
   * Internal method, do not use directly.
   * @param delegateHolder
   * @param namespace
   * @param action
   * @param delegateFunction
   */
  private static removeFrom ( delegateHolder: any, namespace: string, action: string, delegateFunction: any ): void {
    if ( delegateHolder.hasOwnProperty( namespace ) ) {
      if ( delegateHolder[ namespace ].hasOwnProperty( action ) ) {
        const array = delegateHolder[ namespace ][ action ];
        EventManager.remove( array, delegateFunction );
      }
    }
  }

  /**
   * Internal method, do not use directly.
   * @param delegateHolder
   * @param delegateFunction
   */
  private static removeFromAll ( delegateHolder: any, delegateFunction: any ): void {
    const keys = Object.keys( delegateHolder );

    for (const key of keys) {
      const subObjectKeys = Object.keys( delegateHolder[ key ] );
      for (const subKey of subObjectKeys) {
        const array = delegateHolder[ key ][ subKey ];
        EventManager.remove( array, delegateFunction );
      }
    }
  }

  /**
   * Internal method, do not use directly.
   * @param delegateHolder
   * @param namespace
   * @param action
   * @param args
   */
  private static runEvent ( delegateHolder: any, namespace: string, action: string, ...args: any ): void {
    if ( delegateHolder.hasOwnProperty( namespace ) ) {
      if ( delegateHolder[ namespace ].hasOwnProperty( action ) ) {
        const methods = delegateHolder[ namespace ][ action ];
        for (const method of methods) {
          method( ...args );
        }
      }
    }
  }

  /**
   * Single time delegated methods container.
   */
  private readonly oneTimeDelegates: any;

  /**
   * Multiple times delegated methods container.
   */
  private readonly fullTimeDelegates: any;

  /**
   * Main constructor.
   * Resets the delegation objects.
   */
  constructor () {
    this.oneTimeDelegates  = {};
    this.fullTimeDelegates = {};
  }

  /**
   * Add a listener method for a namespace/action layer.
   * @param namespace Namespace for the event to be listened to.
   * @param action Action for the event to be listened to.
   * @param delegateFunction Method to be called on event raise.
   * @param oneTime Defines if the method can be called once and removed from manager, or can be called infinitely on each event raise.
   */
  public addEventListener ( namespace: string, action: string, delegateFunction: any, oneTime: boolean = false ): void {
    const holder = oneTime ? this.oneTimeDelegates : this.fullTimeDelegates;
    EventManager.createEvent( namespace, action, holder );

    const appendTo: any = oneTime ? this.oneTimeDelegates : this.fullTimeDelegates;
    appendTo[ namespace ][ action ].push( delegateFunction );
  }

  /**
   * Remove a previously added listener to a namespace/action layer.
   * @param namespace Remove from this namespace.
   * @param action Remove from this action.
   * @param delegateFunction Method to be removed.
   */
  public removeEventListener ( namespace: string, action: string, delegateFunction: any ): void {
    EventManager.removeFrom( this.oneTimeDelegates, namespace, action, delegateFunction );
    EventManager.removeFrom( this.fullTimeDelegates, namespace, action, delegateFunction );
  }

  /**
   * Remove a previously added listener from all layers.
   * @param delegateFunction Method to be removed.
   */
  public removeListener ( delegateFunction: any ): void {
    EventManager.removeFromAll( this.oneTimeDelegates, delegateFunction );
    EventManager.removeFromAll( this.fullTimeDelegates, delegateFunction );
  }

  /**
   * Raise an event
   * @param namespace Namespace for the to be raised event.
   * @param action Action for the to be raised event.
   * @param args Arguments that will be passed to the delegation methods for this layer.
   */
  public event ( namespace: string, action: string, ...args: any ): void {
    EventManager.runEvent( this.oneTimeDelegates, namespace, action, ...args );
    EventManager.runEvent( this.fullTimeDelegates, namespace, action, ...args );

    // Reset one time calls for this event
    if ( this.oneTimeDelegates.hasOwnProperty( namespace ) ) {
      if ( this.oneTimeDelegates[ namespace ].hasOwnProperty( action ) ) {
        this.oneTimeDelegates[ namespace ][ action ] = [];
      }
    }
  }
}
