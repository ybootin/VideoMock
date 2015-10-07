namespace videomock.event {
  export class MediaEvent {
    static abort: string = 'abort'; // Sent when playback is aborted; for example, if the media is playing and is restarted from the beginning, this event is sent.
    static canplay: string = 'canplay'; // Sent when enough data is available that the media can be played, at least for a couple of frames.  This corresponds to the HAVE_ENOUGH_DATA readyState.
    static canplaythrough: string = 'canplaythrough'; //  Sent when the ready state changes to CAN_PLAY_THROUGH, indicating that the entire media can be played without interruption, assuming the download rate remains at least at the current level. Note: Manually setting the currentTime will eventually fire a canplaythrough event in firefox. Other browsers might not fire this event.
    static durationchange: string = 'durationchange'; //  The metadata has loaded or changed, indicating a change in duration of the media.  This is sent, for example, when the media has loaded enough that the duration is known.
    static emptied: string = 'emptied'; // The media has become empty; for example, this event is sent if the media has already been loaded (or partially loaded), and the load() method is called to reload it.
    static encrypted: string = 'encrypted'; //   The user agent has encountered initialization data in the media data.
    static ended: string = 'ended'; // Sent when playback completes.
    static error: string = 'error'; // Sent when an error occurs.  The element's error attribute contains more information. See Error handling for details.
    static interruptbegin: string = 'interruptbegin'; //  Sent when audio playing on a Firefox OS device is interrupted, either because the app playing the audio is sent to the background, or audio in a higher priority audio channel begins to play. See Using the AudioChannels API for more details.
    static interruptend: string = 'interruptend'; //  Sent when previously interrupted audio on a Firefox OS device commences playing again — when the interruption ends. This is when the associated app comes back to the foreground, or when the higher priority audio finished playing. See Using the AudioChannels API for more details.
    static loadeddata: string = 'loadeddata'; //  The first frame of the media has finished loading.
    static loadedmetadata: string = 'loadedmetadata'; //  The media's metadata has finished loading; all attributes now contain as much useful information as they're going to.
    static loadstart: string = 'loadstart'; // Sent when loading of the media begins.
    static pause: string = 'pause'; // Sent when playback is paused.
    static play: string = 'play'; //  Sent when playback of the media starts after having been paused; that is, when playback is resumed after a prior pause event.
    static playing: string = 'playing'; // Sent when the media begins to play (either for the first time, after having been paused, or after ending and then restarting).
    static progress: string = 'progress'; //  Sent periodically to inform interested parties of progress downloading the media. Information about the current amount of the media that has been downloaded is available in the media element's buffered attribute.
    static ratechange: string = 'ratechange'; //  Sent when the playback speed changes.
    static seeked: string = 'seeked'; //  Sent when a seek operation completes.
    static seeking: string = 'seeking'; // Sent when a seek operation begins.
    static stalled: string = 'stalled'; // Sent when the user agent is trying to fetch media data, but data is unexpectedly not forthcoming.
    static suspend: string = 'suspend'; // Sent when loading of the media is suspended; this may happen either because the download has completed or because it has been paused for any other reason.
    static timeupdate: string = 'timeupdate'; //  The time indicated by the element's currentTime attribute has changed.
    static volumechange: string = 'volumechange'; //  Sent when the audio volume changes (both when the volume is set and when the muted attribute is changed).
    static waiting: string = 'waiting'; // Sent when the requested operation (such as playback) is delayed pending the completion of another operation (such as a seek).
  }
}