import * as t from '@babel/types';

import eventMap from './utils/eventMap';
import { log } from './utils/tools';
import { anyObject } from './types';

export default function jsxElementGenerator(
  vnode: anyObject,
  parentElement: any
) {
  const {
    type,
    events,
    key,
    directives,
    attrs,
    staticClass,
    ifConditions,
    alias
  } = vnode;
  let element: any;
  let wrappedElement: any;

  if (type === 1) {
    // Support following syntax:
    // <div id="34we3" :data="list" v-bind:content="content"/> -> <div id="34we3" data={list} content={content}/>
    let commonAttrs: any[] = [];
    if (attrs) {
      commonAttrs = attrs.map((attr: anyObject) => {
        if (attr.dynamic === false) {
          // attr.dynamic === false
          return t.jSXAttribute(
            t.jSXIdentifier(attr.name),
            t.jSXExpressionContainer(t.identifier(attr.value))
          );
        } else {
          // attr.dynamic === undefined
          return t.jSXAttribute(
            t.jSXIdentifier(attr.name),
            t.stringLiteral(JSON.parse(attr.value))
          );
        }
      });
    }

    // Support following syntax:
    // <div class="wrapper"/> -> <div className="wrapper"/>
    let staticClassAttrs: any[] = [];
    if (staticClass) {
      staticClassAttrs.push(
        t.jSXAttribute(
          t.jSXIdentifier('className'),
          t.stringLiteral(JSON.parse(staticClass))
        )
      );
    }

    // Support following syntax:
    // <div v-on:blur="handleBlur" @click=""handleClick/> -> <div onClick={handleClick} onBlur={handleBlur}/>
    let eventAttrs: any[] = [];
    if (events) {
      Object.keys(events).forEach((key: string) => {
        const eventName = eventMap[key];
        if (!eventName) {
          log(`Not support event name`);
          return;
        }
        eventAttrs.push(
          t.jSXAttribute(
            t.jSXIdentifier(eventName),
            t.stringLiteral(events[key].value)
          )
        );
      });
    }

    // Support following syntax:
    // <div :key="item.id"/> -> <div key={item.id}/>
    let keyAttrs: any[] = [];
    if (key) {
      keyAttrs.push(
        t.jSXAttribute(
          t.jSXIdentifier('key'),
          t.jSXExpressionContainer(t.identifier(key))
        )
      );
    }

    let directivesAttr: any[] = [];
    if (directives) {
      directives.forEach((directive: anyObject) => {
        switch (directive.rawName) {
          case 'v-show':
            // Support following syntax:
            // <div v-show="isLoading"/> -> <div style={{display: isLoading ? 'block' : 'none'}}/>
            directivesAttr.push(
              t.jSXAttribute(
                t.jSXIdentifier('style'),
                t.jSXExpressionContainer(
                  t.objectExpression([
                    t.objectProperty(
                      t.identifier('display'),
                      t.conditionalExpression(
                        t.identifier(directive.value),
                        t.stringLiteral('block'),
                        t.stringLiteral('none')
                      )
                    )
                  ])
                )
              )
            );
            break;
          case 'v-html':
            // Support following syntax:
            // <div v-html="template"/> -> <div dangerouslySetInnerHTML={{__html: template}}/>
            directivesAttr.push(
              t.jSXAttribute(
                t.jSXIdentifier('dangerouslySetInnerHTML'),
                t.jSXExpressionContainer(
                  t.objectExpression([
                    t.objectProperty(
                      t.identifier('__html'),
                      t.identifier(directive.value)
                    )
                  ])
                )
              )
            );
            break;
          default:
            break;
        }
      });
    }

    element = t.jSXElement(
      t.jSXOpeningElement(t.jSXIdentifier(vnode.tag), [
        ...commonAttrs,
        ...staticClassAttrs,
        ...eventAttrs,
        ...keyAttrs,
        ...directivesAttr
      ]),
      t.jSXClosingElement(t.jSXIdentifier(vnode.tag)),
      []
    );

    if (ifConditions) {
      // Support following syntax:
      // <div v-if="show"/> -> {show && <div/>}
      wrappedElement = t.jSXExpressionContainer(
        t.logicalExpression('&&', t.identifier(ifConditions[0].exp), element)
      );
    } else if (alias) {
      // Support following syntax:
      // <div v-for="item in list"/> -> {list.map(item => <div/>)}
      wrappedElement = t.jSXExpressionContainer(
        t.callExpression(
          t.memberExpression(t.identifier(vnode.for), t.identifier('map')),
          [t.arrowFunctionExpression([t.identifier(alias)], element)]
        )
      );
    } else {
      wrappedElement = element;
    }
  } else if (type === 2) {
    // Support following syntax:
    // {{name}} -> {name}
    wrappedElement = t.jSXText(
      vnode.text.replace(/{{/g, '{').replace(/}}/g, '}')
    );
  } else if (type === 3) {
    if (vnode.text) {
      wrappedElement = t.jSXText(vnode.text);
    }
  }

  if (parentElement) {
    parentElement.children.push(wrappedElement);
  }

  if (vnode.children && vnode.children.length > 0) {
    vnode.children.forEach((child: anyObject) => {
      jsxElementGenerator(child, element);
    });
  }

  return t.isJSXExpressionContainer(wrappedElement)
    ? t.jSXElement(
        t.jSXOpeningElement(t.jSXIdentifier('div'), []),
        t.jSXClosingElement(t.jSXIdentifier('div')),
        [wrappedElement]
      )
    : wrappedElement;
}
