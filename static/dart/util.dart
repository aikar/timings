/*
 * Aikar's Minecraft Timings Parser
 *
 * Written by Aikar    <aikar@aikar.co>
 *            DemonWav <demonwav@demonwav.com>
 * http://aikar.co
 * http://starlis.com
 *
 * @license MIT
 */

import 'dart:html';
import 'dart:async';

String htorgba(String hex, [num alpha]) {
  if (alpha == null) {
    alpha = 1;
  }

  RegExp reg = new RegExp(r"^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$");
  List matches = reg.allMatches(hex);

  if (matches.length == 0) {
    return hex;
  } else {
    // TODO: verify the result of RegExp.allMathces() is indexed like js
    return "rgba(" +
      int.parse(matches[1], radix: 16).toString() + "," +
      int.parse(matches[2], radix: 16).toString() + "," +
      int.parse(matches[3], radix: 16).toString() + "," + alpha.toString() + ")";
  }
}

void updateRanges(int start, int end) {
  DateTime startDate = new DateTime.fromMillisecondsSinceEpoch(start * 1000);
  DateTime endDate = new DateTime.fromMillisecondsSinceEpoch(end * 1000);

  querySelector("#start-time").text = startDate.toString();
  querySelector("#end-time").text = endDate.toString();
}

void initializeAds() {
  int adCount = querySelectorAll(".adsbygoogle").length;
  if (adCount != 0) {
    document.body.appendHtml('<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js">');

    // TODO: replace with dummy code
    for (int i = 0; i < adCount; i++) {

    }
  }
}

// keeps track of click events for each element
Map<Element, StreamSubscription> subscriptions = new Map();

void expandTimings(Event e) {
  Element element = e.target as Element;
  Element parent = element.parent;

  // TODO: verify the "invisible" css class will work like I think it will
  parent.querySelector("> .children").classes.remove("invisible");

  Element c = parent.querySelector(" > .expand-control");
  subscriptions[c].cancel();
  c.innerHtml = "[-]";
  subscriptions[c] = c.onClick.listen(collapseTimings);
}

void collapseTimings(Event e) {
  Element element = e.target as Element;
  Element parent = element.parent;

  // TODO: verify the "invisible" css class will work like I think it will
  parent.querySelector("> .children").classes.add("invisible");

  Element c = parent.querySelector(" > .expand-control");
  subscriptions[c].cancel();
  c.innerHtml = "[+]";
  subscriptions[c] = c.onClick.listen(expandTimings);
}

void checkHashLoc() {

}
